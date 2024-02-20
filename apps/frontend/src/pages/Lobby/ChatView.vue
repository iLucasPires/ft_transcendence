<script setup lang="ts">
import type { iChannel, iMessage } from "@/types/props";
import { chatSocket } from "@/socket";

const chatStore = useChatStore();
const {
  currentChat,
  chats,
  currentChatId,
  currentChatName,
  currentChatPhoto,
  currentChatMessages,
  currentChatMembers,
} = storeToRefs(chatStore);

onMounted(() => {
  chatSocket.on("channelsList", (channels: iChannel[]) => chatStore.setChannels(channels));
  chatSocket.on("newMessage", (message: iMessage) => {
    if (chatStore.currentChatId !== message.channelId) return;
    chatStore.addMessage(message);
  });
  chatSocket.emit("fetchChannels");
});

onUnmounted(() => {
  chatSocket.removeListener("channelsList");
  chatSocket.removeListener("newMessage");
});

const message = ref("");

const handleSendMessage = () => {
  const content = message.value.trim();
  if (!currentChat.value || content === "") return;
  chatSocket.emit("sendMessage", { content, channelId: currentChat.value.id }, (msg: iMessage) => {
    chatStore.addMessage(msg);
    message.value = "";
  });
};

const handleClickChat = (chat: iChannel) => {
  chatStore.setCurrentChat(chat);
};

const isCreateGroupModalOpen = ref<boolean>(false);
const isSearchModalOpen = ref<boolean>(false);

const handleClickNewGroup = () => {
  isCreateGroupModalOpen.value = true;
};

const handleClickSearchChat = () => {
  isSearchModalOpen.value = true;
};

const handleCloseCreateGroupModal = () => {
  isCreateGroupModalOpen.value = false;
};

const handleCloseModalSearch = () => {
  isSearchModalOpen.value = false;
};

const handleLeaveChat = () => {
  chatSocket.emit("leaveChannel", currentChatId.value, () => {
    chatSocket.emit("fetchChannels");
  });
};
</script>

<template>
  <main class="full card-padding overflow-hidden">
    <ModalCreateGroupChannel :isOpen="isCreateGroupModalOpen" @closeModal="handleCloseCreateGroupModal" />
    <MModalSearch :isOpen="isSearchModalOpen" @closeModal="handleCloseModalSearch" />
    <div class="grid grid-cols-5 h-full separate">
      <div class="col-span-1 flex flex-col separate border-card overflow-y-hidden">
        <div class="flex justify-between gap-4">
          <h1 class="text-2xl font-bold">Chats</h1>
          <MDropDown @handleClickSearchChat="handleClickSearchChat" @handleClickNewGroup="handleClickNewGroup" />
        </div>
        <ul class="overflow-y-auto h-full flex flex-col gap-2">
          <MCardChatEntry
            v-for="chat in chats"
            :chat="chat"
            :is-current-chat="currentChatId === chat.id"
            @handle-click-chat="handleClickChat(chat)"
          />
        </ul>
      </div>

      <div class="col-span-3 w-full border-card separate overflow-hidden" :class="!currentChat && 'col-span-4'">
        <div class="h-full flex flex-col gap-2 mx-2">
          <div v-if="currentChatMessages.length" class="overflow-y-auto h-full flex flex-col-reverse py-2">
            <ul class="w-full">
              <MCardChat
                v-for="msg in currentChatMessages"
                :key="msg.id"
                :avatarUrl="msg.author.avatarUrl"
                :author="msg.author.username"
                :content="msg.content"
              />
            </ul>
          </div>
          <div v-else class="m-auto">
            <p class="text-2xl font-bold">No messages</p>
          </div>

          <textarea
            type="text"
            name="message"
            class="bg-base-300 h-12 textarea w-full resize-none"
            placeholder="Type a message"
            v-model="message"
            :disabled="!currentChat"
            @input="
              (e: Event) => {
                const element = e.target as HTMLTextAreaElement;
                element.style.height = '18px';
                element.style.height = element.scrollHeight + 'px';
              }
            "
            @keydown.enter.exact.prevent="
              (e: Event) => {
                handleSendMessage();
                const element = e.target as HTMLTextAreaElement;
                element.style.height = '18px';
              }
            "
          />
        </div>
      </div>

      <div v-if="currentChat !== null" class="col-span-1 flex flex-col items-center border-card full p-4 gap-2">
        <AChatImage :image-url="currentChatPhoto" />
        <h1 class="text-2xl font-bold text-center">{{ currentChatName }}</h1>
        <div class="w-full border-card p-4 rounded flex-1">
          <span class="block text-lg font-bold mb-2">Channel Members</span>
          <ul class="overflow-y-auto h-full flex flex-col gap-2">
            <li v-for="member in currentChatMembers">
              <details class="rounded-md bg-base-300 overflow-hidden">
                <summary class="list-none p-2 flex items-center gap-2 bg-base-200">
                  <AChatImage class="h-8 w-8" :image-url="member.avatarUrl" />
                  <span class="font-bold">{{ member.username }}</span>
                </summary>
                <ul class="p-2">
                  <li class="">
                    <AButton class="btn-sm w-full flex justify-start" text="Profile" icon="md-person" />
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div class="w-full border-card p-4 rounded">
          <span class="block text-lg font-bold mb-2">Channel Settings</span>
          <ul class="overflow-y-auto h-full flex flex-col gap-2">
            <li>
              <AButton
                class="btn-sm w-full flex justify-start"
                text="Leave Channel"
                icon="md-exit"
                @click="handleLeaveChat()"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>
