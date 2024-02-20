<script setup lang="ts">
import { chatSocket } from "@/socket";
import type { iMessage } from "@/types/props";

const chatStore = useChatStore();

const handleSendMessage = (content: string) => {
  if (!chatStore.currentChat || content === "") return;

  const message = { content, channelId: chatStore.currentChat.id };
  const callback = (msg: iMessage) => chatStore.addMessage(msg);
  chatSocket.emit("sendMessage", message, callback);
};
</script>

<template>
  <div class="col-span-3 w-full border-card separate overflow-hidden" :class="!chatStore.currentChat && 'col-span-4'">
    <div v-if="chatStore.currentChat" class="gap-2 py-2 h-full flex flex-col">
      <div class="flex-1 flex flex-col-reverse overflow-y-auto" id="chat-messages">
        <ul class="w-full">
          <MCardChat
            v-for="msg in chatStore.currentChatMessages"
            :key="msg.id"
            :avatarUrl="msg.author.avatarUrl"
            :author="msg.author.username"
            :content="msg.content"
          />
        </ul>
      </div>
      <ATextArea @sendMessage="handleSendMessage" />
    </div>
    <div v-else class="m-auto text-center">
      <h2 class="text-2xl font-bold">Whatsapp 2.0</h2>
      <p class="text-lg">Select a chat to start messaging</p>
    </div>
  </div>
</template>
