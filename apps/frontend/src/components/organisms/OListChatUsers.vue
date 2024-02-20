<script setup lang="ts">
const chatStore = useChatStore();
</script>

<template>
  <div class="flex flex-col separate border-card overflow-y-hidden">
    <div class="flex justify-between gap-4">
      <h1 class="text-2xl font-bold">Chats</h1>
      <MDropDownChat />
    </div>
    <ul class="overflow-y-auto h-full flex flex-col gap-2">
      <li
        v-for="chat in chatStore.chats"
        class="flex items-center separate cursor-pointer border-card hover:border-primary"
        :class="chatStore.currentChatId === chat.id && 'border-primary'"
        @click="chatStore.setCurrentChat(chat)"
      >
        <AChatImage :image-url="chatStore.getChatPhoto(chat)" />
        <h2 class="title" v-text="chatStore.getChatName(chat)" />
      </li>
    </ul>
  </div>
</template>
