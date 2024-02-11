<script setup lang="ts">
import { chatSocket } from "@/socket";
import { useChatStore } from "@/stores/chatStore";
import type { iChannel, iMessage } from "@/types/props";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";

const chatStore = useChatStore();
const { currentChat, chats, currentChatId, currentChatMessages  } = storeToRefs(chatStore);

onMounted(() => {
  chatSocket.on("channelsList", (channels: iChannel[]) => {
    chatStore.setChannels(channels);
  });
  chatSocket.on("newMessage", (message: iMessage) => {
    console.log(chatStore.currentChatId, message);
    if (chatStore.currentChatId !== message.channelId) {
      return;
    }
    chatStore.addMessage(message);
  });
  chatSocket.emit("fetchChannels");
});

onUnmounted(() => {
  chatSocket.removeAllListeners();
});

const message = ref("");

const handleSendMessage = () => {
  const content = message.value.trim();

  if (!currentChat.value || content === "") {
    return;
  }
  chatSocket.emit("sendMessage", { content, channelId: currentChat.value.id }, (msg: iMessage) => {
    chatStore.addMessage(msg);
    message.value = "";
  });
};

const handleClickChat = (chat: iChannel) => {
  chatStore.setCurrentChat(chat);
};
</script>

<template>
  <main class="full card-padding overflow-hidden">
    <div class="row h-full separate">
      <div class="w-96 border-card p-4">
        <input type="text" class="input input-bordered w-full" placeholder="Search" />
        <ul class="overflow-y-auto h-full flex flex-col gap-2 mt-4">
          <li
            class="flex items-center separate cursor-pointer border-card"
            v-for="chat in chats"
            :class="currentChatId === chat.id && 'border-primary'"
            v-on:click="handleClickChat(chat)"
            :key="chat.id"
          >
            <div class="avatar">
              <div class="w-16 rounded-full bg-base-200">
                <img :src="chatStore.getChatPhoto(chat)" :alt="'Chat image'" />
              </div>
            </div>
            <h2 class="title" v-text="chatStore.getChatName(chat)" />
          </li>
        </ul>
      </div>

      <div class="w-full border-card separate flex flex-col h-full">
        <div class="h-full flex flex-col gap-2">
          <div v-if="currentChatMessages.length !== 0" class="overflow-y-auto h-full flex flex-col-reverse py-2">
            <ul class="flex flex-col gap-2">
              <li class="border-card p-4" v-for="message in currentChatMessages" :key="message.id">
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-16 rounded-full bg-base-200">
                      <img :src="message.author.avatarUrl" :alt="`avatar of ${message.author.username}`" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-md" v-text="message.author.username" />
                    <p class="text-md font-bold" v-text="message.content" />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <p class="text-2xl font-bold">No messages</p>
          </div>

          <form class="flex items-center" v-on:submit.prevent="handleSendMessage">
            <textarea
              type="text"
              name="message"
              class="textarea bg-base-300 w-full h-5 resize-y"
              placeholder="Type a message"
              v-model="message"
              :disabled="!currentChat"
            />
            <button class="btn btn-primary ml-2 h-5" :disabled="!currentChat">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
