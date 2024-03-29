<script setup lang="ts">
import { chatSocket, gameSocket } from "@/socket";
import type { iChannel, iMember, iUser } from "@/types/props";

const meStore = useMeStore();
const chatStore = useChatStore();
const { currentChat, currentChatId, currentChatPhoto, currentChatName, currentChatMembers } = storeToRefs(chatStore);

const userProfile = ref<iUser | null>(null);
const bannedUsers = ref<iUser[] | null>(null);
const channelForPasswordChange = ref<iChannel | null>(null);

const handleClickBlock = (username: string) => {
  chatSocket.emit("blockUser", username);
};

const handleClickUnblock = (username: string) => {
  chatSocket.emit("unblockUser", username);
};

const handlePrivateMessage = (username: string) => {
  chatStore.openDmChat(username);
};

const handleOpenProfile = (username: string) => {
  chatSocket.emit("fetchUserProfile", username, (user: iUser) => {
    userProfile.value = user;
  });
};

const handleInviteToGame = (username: string) => {
  gameSocket.emit("inviteToGame", username);
};

const handleLeaveChat = () => {
  chatSocket.emit("leaveChannel", chatStore.currentChatId);
};

const showAdminOptions = (member: iMember) => {
  if (chatStore.currentChat?.type !== "group") {
    return false;
  }

  const ownerId = chatStore.currentChat?.owner?.id;
  const isOwnUser = member.id === meStore.data?.id;

  if (ownerId === meStore.data?.id) {
    return !isOwnUser;
  }
  if (chatStore.currentChat?.isChannelAdmin) {
    return !isOwnUser && member.id !== ownerId;
  }
  return false;
};

const handleSetAdmin = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("addChannelAdmin", data);
};

const handleUnsetAdmin = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("removeChannelAdmin", data);
};

const handleMuteChannelMember = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("muteChannelMember", data);
};

const handleUnmuteChannelMember = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("unmuteChannelMember", data);
};

const handleKickUser = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("kickUser", data);
};

const handleBanUser = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("banChannelMember", data);
};

const handleUnbanUser = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("unbanChannelMember", data, () => {
    bannedUsers.value = bannedUsers.value?.filter((user) => user.username !== username) ?? null;
  });
};

const handleGetChannelBans = () => {
  chatSocket.emit("fetchChannelBans", currentChatId.value, (users: iUser[]) => {
    bannedUsers.value = users;
  });
};

const handleCloseBansModal = () => {
  bannedUsers.value = null;
};

const handleOpenChangePasswordModal = () => {
  channelForPasswordChange.value = currentChat.value;
};

const handleCloseChangePasswordModal = () => {
  channelForPasswordChange.value = null;
};
</script>

<template>
  <div v-if="currentChat" class="flex overflow-hidden flex-col items-center border-card size-full p-4 space-y-2">
    <MModalProfile v-if="!!userProfile" :user="userProfile" @clickClose="userProfile = null" />
    <MModalBans v-model="bannedUsers" @handleUnban="handleUnbanUser" @handleCloseModal="handleCloseBansModal" />
    <MModalSetChannelPassword v-model="channelForPasswordChange" @handle-close="handleCloseChangePasswordModal" />

    <AChatImage class="h-16 w-16" :image-url="currentChatPhoto" />
    <h1 class="text-2xl font-bold">{{ currentChatName }}</h1>
    <div class="w-full flex flex-col overflow-hidden border-card p-4 rounded flex-1">
      <span class="block text-lg font-bold mb-2">Channel Members</span>
      <ul class="overflow-y-auto flex flex-col h-full gap-2">
        <li v-for="member in currentChatMembers">
          <details class="bg-base-200 overflow-hidden join join-vertical w-full select-none">
            <summary
              class="list-none p-2 flex items-center gap-2 bg-base-200"
              :class="(currentChat?.isChannelAdmin || !member.isBlockedBy) && 'cursor-pointer'"
            >
              <AChatImage
                class="h-8 w-8"
                :image-url="member.avatarUrl || `https://robohash.org/${member.username}.png`"
              />
              <span class="font-bold">{{ member.username }}</span>
              <Icon v-if="member?.isMuted" name="md-volumeoff-round" />
              <span v-if="currentChat.owner?.id === member.id" class="badge badge-sm font-bold badge-primary"
                >Owner</span
              >
              <span v-else-if="member?.isChannelAdmin" class="badge badge-sm font-bold badge-primary">Admin</span>
            </summary>
            <div v-if="!member.isBlockedBy" class="w-full">
              <AButton
                class="btn-sm btn-ghost join-item justify-start w-full"
                text="Profile"
                icon="md-person"
                @click.prevent="handleOpenProfile(member.username)"
              />
              <AButton
                v-if="member.id !== meStore.data?.id"
                class="btn-sm btn-ghost join-item justify-start w-full"
                text="Invite to Game"
                icon="md-videogameasset"
                :disabled="member.isBlocked"
                @click.prevent="handleInviteToGame(member.username)"
              />
              <template v-if="member.id !== meStore.data?.id">
                <AButton
                  v-if="currentChat?.type === 'group'"
                  class="btn-sm btn-ghost join-item justify-start w-full disabled:cursor-not-allowed"
                  text="Private Message"
                  icon="md-message"
                  :disabled="member.isBlocked"
                  @click="handlePrivateMessage(member.username)"
                />
                <AButton
                  v-if="!member.isBlocked"
                  class="btn-sm btn-ghost join-item justify-start w-full"
                  text="Block"
                  icon="md-block"
                  @click="handleClickBlock(member.username)"
                />
                <AButton
                  v-else
                  class="btn-sm btn-ghost join-item justify-start w-full"
                  text="Unblock"
                  icon="md-block"
                  @click="handleClickUnblock(member.username)"
                />
              </template>
            </div>
            <div class="flex flex-col" v-if="showAdminOptions(member)">
              <div v-if="!member.isBlockedBy" class="divider my-0 mx-2" />
              <AButton
                v-if="!member.isChannelAdmin && currentChat?.owner?.id === meStore.data?.id"
                class="btn-sm btn-ghost join-item justify-start"
                text="Set as Admin"
                icon="md-adminpanelsettings"
                @click="handleSetAdmin(member.username)"
              />
              <AButton
                v-else-if="currentChat?.owner?.id === meStore.data?.id"
                class="btn-sm btn-ghost join-item justify-start"
                text="Unset as Admin"
                icon="md-adminpanelsettings"
                @click="handleUnsetAdmin(member.username)"
              />
              <AButton
                v-if="!member.isMuted"
                class="btn-sm btn-ghost join-item justify-start w-full"
                text="Mute"
                icon="md-volumeoff-round"
                @click.prevent="handleMuteChannelMember(member.username)"
              />
              <AButton
                v-else
                class="btn-sm btn-ghost join-item justify-start w-full"
                text="Unmute"
                icon="md-volumeup-round"
                @click.prevent="handleUnmuteChannelMember(member.username)"
              />
              <AButton
                class="btn-sm btn-ghost join-item justify-start"
                text="Kick"
                icon="bi-wind"
                @click="handleKickUser(member.username)"
              />
              <AButton
                class="btn-sm btn-ghost join-item justify-start"
                text="Ban"
                icon="md-block"
                @click="handleBanUser(member.username)"
              />
            </div>
          </details>
        </li>
      </ul>
    </div>

    <div v-if="currentChat?.type === 'group'" class="w-full border-card p-4 rounded">
      <span class="block text-lg font-bold mb-2">Channel Settings</span>
      <div class="join join-vertical w-full">
        <template v-if="currentChat?.isChannelAdmin">
          <AButton
            v-if="currentChat?.visibility === 'public'"
            icon="md-key"
            class="join-item btn-sm justify-start"
            text="Set Channel Password"
            @click.prevent="handleOpenChangePasswordModal"
          />
          <AButton
            v-else
            icon="md-key"
            class="join-item btn-sm justify-start"
            text="Change Channel Password"
            @click.prevent="handleOpenChangePasswordModal"
          />
          <AButton
            icon="md-shield-twotone"
            class="join-item btn-sm justify-start"
            text="Channel Bans"
            @click.prevent="handleGetChannelBans()"
          />
        </template>
        <AButton
          icon="md-exittoapp-round"
          class="join-item btn-sm justify-start"
          text="Leave Channel"
          @click.prevent="handleLeaveChat()"
        />
      </div>
    </div>
  </div>
</template>
