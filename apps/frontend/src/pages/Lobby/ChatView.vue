<script setup lang="ts">
import type { iChannel, iMessage } from "@/types/props";
import { chatSocket } from "@/socket";

const chatStore = useChatStore();

onMounted(() => {
  chatSocket.on("channelsList", (channels: iChannel[]) => chatStore.setChannels(channels));
  chatSocket.on("newMessage", (message: iMessage) => {
    chatStore.currentChatId === message.channelId && chatStore.addMessage(message);
  });
  chatSocket.on("hasUpdates", () => {
    chatSocket.emit("fetchChannels");
    chatStore.updateCurrentChat();
  });
  chatSocket.on("mutedFromChannel", (channelId: string) => {
    const appStore = useAppStore();
    const channel = chatStore.chats.find((c) => c.id === channelId);

    appStore.changeMessageLog(`Warning: you have been muted on channel ${channel?.name} for 15 minutes`);
  });
  chatSocket.on("kickedFromChannel", (channelId: string) => {
    const appStore = useAppStore();
    const channel = chatStore.chats.find((c) => c.id === channelId);

    appStore.changeMessageLog(`You have been kicked from the channel ${channel?.name}`);
    chatSocket.emit("fetchChannels");
  });
  chatSocket.on("bannedFromChannel", (channelId: string) => {
    const appStore = useAppStore();
    const channel = chatStore.chats.find((c) => c.id === channelId);

    appStore.changeMessageLog(`You have been banned from the channel ${channel?.name}`);
    chatSocket.emit("fetchChannels");
  });
  chatSocket.emit("fetchChannels");
  chatStore.updateCurrentChat();
});

onUnmounted(() => {
  chatSocket.removeListener("channelsList");
  chatSocket.removeListener("newMessage");
});
</script>

<template>
  <main class="full card-padding overflow-hidden">
    <ModalCreateGroupChannel />
    <MModalSearch />

    <div class="grid grid-cols-5 h-full separate">
      <OListChatUsers />
      <OListChatMessages />
      <ODetailChat />
    </div>
  </main>
</template>
