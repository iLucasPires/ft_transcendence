import { WsGuard } from "@/auth/guards/ws.guard";
import { ChannelsService } from "@/channels/channels.service";
import { AdminActionDto, CreateGroupChannelDto, JoinGroupChannelDto } from "@/channels/dto";
import { RemoveChannelPasswordDto } from "@/channels/dto/remove-channel-password.dto";
import { SetChannelPasswordDto } from "@/channels/dto/set-channel-password.dto";
import { ConnectionStatusService } from "@/connection-status/connection-status.service";
import { HttpExceptionFilter } from "@/http-exception.filter";
import { UsersService } from "@/users/users.service";
import { Inject, Logger, UseFilters, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import * as bcrypt from "bcrypt";
import { Server, Socket } from "socket.io";

@UseGuards(WsGuard)
@UseFilters(HttpExceptionFilter)
@WebSocketGateway({
  namespace: "/chat",
  path: "/api/socket.io",
})
export class ChatGateway implements OnGatewayConnection {
  logger = new Logger("ChatGateway");

  @WebSocketServer()
  server: Server;

  @Inject()
  channelsService: ChannelsService;
  @Inject()
  usersService: UsersService;
  @Inject()
  connectionStatusService: ConnectionStatusService;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { request } = client;

    if (!request.isAuthenticated()) {
      this.logger.log("Disconnected unauthorized client");
      client.disconnect(true);
      return;
    }
    client.join(request.user.id);
  }

  @SubscribeMessage("fetchChannels")
  async handleFetchChannels(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const channels = await this.channelsService.findUserChannels(loggedInUser);
    client.emit("channelsList", channels);
  }

  @SubscribeMessage("searchChannels")
  async handleSearchChannels(@ConnectedSocket() client: Socket, @MessageBody() query: string) {
    const loggedInUser = client.request.user;
    const results = await this.channelsService.searchChannels(loggedInUser, query);

    client.emit("searchResults", results);
  }

  @SubscribeMessage("enterDmChat")
  async handleEnterDmChat(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const dmUser = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!dmUser) {
      throw new WsException(`User not found: ${username}`);
    }
    let channel = await this.channelsService.findDmChannel(loggedInUser, dmUser);
    if (!channel) {
      channel = await this.channelsService.createDmChannel(loggedInUser, dmUser);
      this.server.to([loggedInUser.id, dmUser.id]).emit("hasUpdates");
    }
    client.join(channel.id);
    return {
      ...channel,
      messages: await this.channelsService.findChannelMessages(channel.id),
    };
  }

  @SubscribeMessage("createGroupChat")
  async handleCreateGroupChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() { name, password }: CreateGroupChannelDto,
  ) {
    const loggedInUser = client.request.user;

    if (!name) {
      throw new WsException("Group name cannot be empty");
    }
    let hashedPassword = undefined;
    if (!!password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const channel = await this.channelsService.createGroupChannel(name, loggedInUser, hashedPassword);

    return {
      ...channel,
      messages: [],
    };
  }

  @SubscribeMessage("joinGroupChat")
  async handleJoinGroupChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, password }: JoinGroupChannelDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);
    const isBanned = await this.channelsService.memberIsBanned(channelId, loggedInUser.id);

    if (!!password) {
      const channelPassword = await this.channelsService.getChannelPassword(channelId);
      const passwordMatch = await bcrypt.compare(password, channelPassword);
      if (!passwordMatch) {
        throw new WsException("Invalid password");
      }
    }
    if (isBanned) {
      throw new WsException("You are banned from this channel D:");
    }

    await this.channelsService.joinGroupChannel(channelId, loggedInUser.id);
    client.join(channel.id);
    this.server.to(channelId).emit("hasUpdates");

    const updatedChannel = await this.channelsService.findChannelById(loggedInUser, channelId);
    return {
      ...updatedChannel,
      messages: await this.channelsService.findChannelMessages(channel.id),
    };
  }

  @SubscribeMessage("enterGroupChat")
  async handleEnterGroupChat(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    client.join(channel.id);
    return {
      ...channel,
      messages: await this.channelsService.findChannelMessages(channel.id),
    };
  }

  @SubscribeMessage("unfocusChannel")
  async handleUnfocusChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    client.leave(channelId);
  }

  @SubscribeMessage("leaveChannel")
  async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (channel.type === "dm") {
      throw new WsException("Cannot leave DM channel");
    }
    client.leave(channelId);
    await this.channelsService.leaveGroupChannel(channel, loggedInUser);
    this.server.to([loggedInUser.id, channelId]).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; content: string },
  ) {
    const author = client.request.user;
    const { channelId, content } = data;

    if (this.channelsService.memberIsMuted(channelId, author.id)) {
      throw new WsException("You are muted in this channel");
    }
    const message = await this.channelsService.sendMessage(channelId, author.id, content);
    client.to(channelId).emit("newMessage", message);
    return message;
  }

  @SubscribeMessage("fetchUserProfile")
  async handleFetchUserProfile(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const user = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    return user;
  }

  @SubscribeMessage("blockUser")
  async handleBlockUser(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const user = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    await this.usersService.block(loggedInUser, user);
    this.server.to([loggedInUser.id, user.id]).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("unblockUser")
  async handleUnblockUser(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const user = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    await this.usersService.unblock(loggedInUser, user);
    this.server.to([loggedInUser.id, user.id]).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("addChannelAdmin")
  async handleAddChannelAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, username }: AdminActionDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const userIsChannelMember = channel.members.some((m) => m.id === user.id);
    if (!userIsChannelMember) {
      throw new WsException(`User is not a member of this channel: ${username}`);
    }
    await this.channelsService.addChannelAdmin(channelId, user.id);
    this.server.to(channelId).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("removeChannelAdmin")
  async handleRemoveChannelAdmin(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, username }: AdminActionDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const userIsChannelMember = channel.members.some((m) => m.id === user.id);
    if (!userIsChannelMember) {
      throw new WsException(`User is not a member of this channel: ${username}`);
    }
    await this.channelsService.removeChannelAdmin(channelId, user.id);
    this.server.to(channelId).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("kickUser")
  async handleKickUser(@ConnectedSocket() client: Socket, @MessageBody() { channelId, username }: AdminActionDto) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const userIsChannelMember = channel.members.some((m) => m.id === user.id);
    if (!userIsChannelMember) {
      throw new WsException(`User is not a member of this channel: ${username}`);
    }

    if (channel.owner.id === user.id) {
      throw new WsException("Cannot kick the owner of the channel");
    }
    const isChannelOwner = channel.owner.id === loggedInUser.id;
    const userIsChannelAdmin = channel.members.some((m) => m.id === loggedInUser.id && m.isChannelAdmin);
    if (!isChannelOwner && userIsChannelAdmin) {
      throw new WsException("You cannot kick a channel admin!");
    }

    await this.channelsService.leaveGroupChannel(channel, user);
    if (this.connectionStatusService.isConnected(user.id)) {
      this.server.to(user.id).emit("kickedFromChannel", channel.id);
    }
    this.server.to([channelId, user.id]).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("muteChannelMember")
  async handleMuteChannelMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, username }: AdminActionDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const userIsChannelMember = channel.members.some((m) => m.id === user.id);
    if (!userIsChannelMember) {
      throw new WsException(`User is not a member of this channel: ${username}`);
    }

    if (channel.owner.id === user.id) {
      throw new WsException("Cannot mute the owner of the channel");
    }
    const isChannelOwner = channel.owner.id === loggedInUser.id;
    const userIsChannelAdmin = channel.members.some((m) => m.id === loggedInUser.id && m.isChannelAdmin);
    if (!isChannelOwner && userIsChannelAdmin) {
      throw new WsException("You cannot mute a channel admin!");
    }

    this.channelsService.muteChannelMember(channelId, user.id);
    this.server.to(channelId).emit("hasUpdates");
    if (this.connectionStatusService.isConnected(user.id)) {
      this.server.to(user.id).emit("mutedFromChannel", channel.id);
    }
    return "ok";
  }

  @SubscribeMessage("unmuteChannelMember")
  async handleUnmuteChannelMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, username }: AdminActionDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const userIsChannelMember = channel.members.some((m) => m.id === user.id);
    if (!userIsChannelMember) {
      throw new WsException(`User is not a member of this channel: ${username}`);
    }

    if (channel.owner.id === user.id) {
      throw new WsException("Cannot unmute the owner of the channel");
    }
    const isChannelOwner = channel.owner.id === loggedInUser.id;
    const userIsChannelAdmin = channel.members.some((m) => m.id === loggedInUser.id && m.isChannelAdmin);
    if (!isChannelOwner && userIsChannelAdmin) {
      throw new WsException("You cannot unmute a channel admin!");
    }

    this.channelsService.unmuteChannelMember(channelId, user.id);
    this.server.to(channelId).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("banChannelMember")
  async handleBanChannelMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, username }: AdminActionDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const userIsChannelMember = channel.members.some((m) => m.id === user.id);
    if (!userIsChannelMember) {
      throw new WsException(`User is not a member of this channel: ${username}`);
    }

    if (channel.owner.id === user.id) {
      throw new WsException("Cannot ban the owner of the channel");
    }
    const isChannelOwner = channel.owner.id === loggedInUser.id;
    const userIsChannelAdmin = channel.members.some((m) => m.id === loggedInUser.id && m.isChannelAdmin);
    if (!isChannelOwner && userIsChannelAdmin) {
      throw new WsException("You cannot ban a channel admin!");
    }

    await this.channelsService.leaveGroupChannel(channel, user);
    await this.channelsService.banChannelMember(channelId, user.id);
    if (this.connectionStatusService.isConnected(user.id)) {
      this.server.to(user.id).emit("bannedFromChannel", channel.id);
    }
    this.server.to([channelId, user.id]).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("unbanChannelMember")
  async handleUnbanChannelMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, username }: AdminActionDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel");
    }

    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new WsException(`User not found: ${username}`);
    }
    const isBanned = await this.channelsService.memberIsBanned(channelId, user.id);
    if (!isBanned) {
      throw new WsException("User is not banned from channel");
    }
    await this.channelsService.unbanChannelMember(channelId, user.id);
    this.server.to(channelId).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("fetchChannelBans")
  async handleFetchChannelBans(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("User not is ADM");
    }

    return await this.channelsService.fetchChannelBans(channelId);
  }

  @SubscribeMessage("setChannelPassword")
  async handleSetChannelPassword(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, currentPassword, newPassword }: SetChannelPasswordDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel!");
    }
    if (channel.visibility === "private") {
      const channelPassword = await this.channelsService.getChannelPassword(channelId);
      const passwordMatch = await bcrypt.compare(currentPassword ?? "", channelPassword);
      if (!passwordMatch) {
        throw new WsException("Invalid current password");
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.channelsService.setChannelPassword(channelId, hashedPassword);
    this.server.to(channelId).emit("hasUpdates");
    return "ok";
  }

  @SubscribeMessage("removeChannelPassword")
  async handleRemoveChannelPassword(
    @ConnectedSocket() client: Socket,
    @MessageBody() { channelId, password }: RemoveChannelPasswordDto,
  ) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    if (!channel) {
      throw new WsException(`Channel not found: ${channelId}`);
    }
    if (!channel.isChannelAdmin) {
      throw new WsException("You are not an admin of this channel!");
    }
    if (channel.visibility !== "private") {
      throw new WsException("Channel is not private");
    }
    const channelPassword = await this.channelsService.getChannelPassword(channelId);
    const passwordMatch = await bcrypt.compare(password, channelPassword);
    if (!passwordMatch) {
      throw new WsException("Invalid password");
    }
    await this.channelsService.removeChannelPassword(channelId);
    this.server.to(channelId).emit("hasUpdates");
    return "ok";
  }
}
