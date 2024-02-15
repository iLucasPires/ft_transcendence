import router from "@/routes/vueRouter";
import { chatSocket } from "@/socket";

import type { iChannel, iCurrentChannel, iMessage } from "@/types/props";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chatStore", {
  state: () => ({
    chats: [] as iChannel[],
    currentChat: null as null | iCurrentChannel,
  }),

  actions: {
    openDmChat(username: string) {
      chatSocket.emit("enterDmChat", username, (channel: iCurrentChannel) => {
        this.currentChat = channel;
        router.push("/chat");
      });
    },

    setChannels(channels: iChannel[]) {
      this.chats = channels;
      if (!channels.find(({ id }) => id === this.currentChat?.id)) {
        this.currentChat = null;
      }
    },

    addMessage(msg: iMessage) {
      if (!this.currentChat) {
        return;
      }
      this.currentChat.messages.push(msg);
    },

    setCurrentChat(channel: iChannel | null) {
      if (channel === null) {
        if (this.currentChatId) {
          chatSocket.emit("leaveChannel", this.currentChatId);
        }
        this.currentChat = null;
        return;
      }
      const events = { dm: "enterDmChat", group: "enterGroupChat" };
      const event = events[channel.type];

      chatSocket.emit(
        event,
        event === events.dm ? this.getChatName(channel) : channel.id,
        (channel: iCurrentChannel) => {
          if (this.currentChatId) {
            chatSocket.emit("leaveChannel", this.currentChatId);
          }
          this.currentChat = channel;
        },
      );
    },

    getChatName(channel: iChannel): string | undefined {
      const meStore = useMeStore();

      if (channel.type === "dm") {
        return channel.members.find(({ id }) => id !== meStore.data?.id)!.username;
      }
      return channel.name;
    },

    getChatPhoto(channel: iChannel): string {
      const meStore = useMeStore();

      if (channel.type === "dm") {
        const member = channel.members.find(({ id }) => id !== meStore.data?.id);
        return member?.avatarUrl || `https://robohash.org/${this.getChatName(channel)}.png`;
      }
      return "/group.png";
    },
  },
  getters: {
    currentChatId(): string | undefined {
      return this.currentChat?.id;
    },

    currentChatName(): string | undefined {
      const meStore = useMeStore();

      if (this.currentChat?.type === "dm") {
        return this.currentChat.members.find(({ id }) => id !== meStore.data?.id)?.username;
      }
      return this.currentChat?.name;
    },

    currentChatPhoto(): string {
      const meStore = useMeStore();

      if (this.currentChat?.type === "dm") {
        const member = this.currentChat.members.find(({ id }) => id !== meStore.data?.id)!;
        return member.avatarUrl || `https://robohash.org/${member.username}.png`;
      }
      return "/group.png";
    },

    currentChatMessages(): iMessage[] {
      if (!this.currentChat) return [];
      return this.currentChat.messages;
    },

    currentChatMembers(): iChannel["members"] {
      return this.currentChat?.members || [];
    },
  },
});
