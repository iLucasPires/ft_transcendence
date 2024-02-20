<script setup lang="ts">
import { chatSocket } from "@/socket";

const chatStore = useChatStore();
const { currentChat, currentChatPhoto, currentChatName, currentChatMembers } = storeToRefs(chatStore);

const handleLeaveChat = () => {
  chatSocket.emit("leaveChannel", chatStore.currentChatId, () => {
    chatSocket.emit("fetchChannels");
  });
};
</script>

<template>
  <div v-if="currentChat" class="flex overflow-hidden flex-col items-center border-card full p-4 space-y-2">
    <AChatImage class="h-16 w-16" :image-url="currentChatPhoto" />
    <h1 class="text-2xl font-bold">{{ currentChatName }}</h1>
    <div class="w-full flex flex-col overflow-hidden border-card p-4 rounded flex-1">
      <span class="block text-lg font-bold mb-2">Channel Members</span>
      <ul class="overflow-y-auto flex flex-col h-full gap-2">
        <li v-for="member in currentChatMembers">
          <details class="rounded-md bg-base-200 overflow-hidden">
            <summary class="list-none p-2 flex items-center gap-2 bg-base-200">
              <AChatImage
                class="h-8 w-8"
                :image-url="member.avatarUrl || `https://robohash.org/${member.username}.png`"
              />
              <span class="font-bold">{{ member.username }}</span>
            </summary>
            <div class="join join-vertical w-full">
              <AButton class="btn-sm join-iteml flex justify-start" text="Profile" icon="md-person" />
              <AButton class="btn-sm join-iteml flex justify-start" text="Mute" icon="md-volume-off" />
              <AButton class="btn-sm join-iteml flex justify-start" text="Remove" icon="md-trash" />
            </div>
          </details>
        </li>
      </ul>
    </div>

    <div v-if="currentChat?.type === 'group'" class="w-full border-card p-4 rounded">
      <span class="block text-lg font-bold mb-2">Channel Settings</span>
      <div class="join join-vertical w-full">
        <AButton
          icon="md-exit"
          class="join-item btn-sm flex justify-start"
          text="Leave Channel"
          @click="() => handleLeaveChat()"
        />
      </div>
    </div>
  </div>
</template>
