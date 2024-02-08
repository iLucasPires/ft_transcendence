import router from "@/routes/vueRouter";
import { useMeStore } from "@/stores/meStore";
import { chatSocket } from "@/socket";
import type { iChannel } from "@/types/props";
import { defineStore } from "pinia";

export const useChatStore = defineStore("chatStore", {
  state: () => ({
    currentChat: null as null | iChannel,
    chats: [] as iChannel[],
  }),

  actions: {
    openDmChat(username: string) {
      chatSocket.emit("enterDmChat", username, (channel: iChannel) => {
        this.currentChat = channel;
        router.push("/chat");
      });
    },
    setChannels(channels: iChannel[]) {
      this.chats = channels;
      if (!channels.find(({ id }) => id === this.currentChat?.id)) {
        this.currentChat = channels[0] || null;
      }
    },
    setCurrentChat(channel: iChannel | null) {
      this.currentChat = channel;

      if (channel) {
        const events = { dm: "enterDmChat" };
        const event = events[channel.type];
        chatSocket.emit(event, event === events.dm ? this.getChatName(channel) : channel.id);
      }
    },

    getChatName(channel: iChannel): string | undefined {
      const meStore = useMeStore();

      if (channel.type === "dm") {
        return channel.members.find(({ id }) => id !== meStore.data?.id)?.username;
      }
    },
    getChatPhoto(channel: iChannel): string | undefined {
      const meStore = useMeStore();

      if (channel.type === "dm") {
        return channel.members.find(({ id }) => id !== meStore.data?.id)?.avatarUrl;
      }
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
    },
    currentChatPhoto(): string | undefined {
      const meStore = useMeStore();

      if (this.currentChat?.type === "dm") {
        return this.currentChat.members.find(({ id }) => id !== meStore.data?.id)?.avatarUrl;
      }
    },
  },
});
