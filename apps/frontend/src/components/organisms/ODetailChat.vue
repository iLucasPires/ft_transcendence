<script setup lang="ts">
import { chatSocket } from "@/socket";
import type { iMember, iUser } from "@/types/props";
import { MdRememberme } from "oh-vue-icons/icons";

const meStore = useMeStore();
const chatStore = useChatStore();
const { currentChat, currentChatPhoto, currentChatName, currentChatMembers } = storeToRefs(chatStore);

const userProfile = ref<iUser | null>(null);

const handleClickBlock = (username: string) => {
  chatSocket.emit("blockUser", username, () => {
    chatSocket.emit("fetchChannels");
    chatStore.setCurrentChat(chatStore.currentChat);
  });
};

const handlePrivateMessage = (username: string) => {
  chatStore.openDmChat(username);
  chatSocket.emit("fetchChannels");
};

const handleOpenProfile = (username: string) => {
  chatSocket.emit("fetchUserProfile", username, (user: iUser) => {
    userProfile.value = user;
  });
};

const handleLeaveChat = () => {
  chatSocket.emit("leaveChannel", chatStore.currentChatId, () => {
    chatSocket.emit("fetchChannels");
  });
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
  chatSocket.emit("addChannelAdmin", data, () => {
    chatStore.setCurrentChat(chatStore.currentChat);
  });
};

const handleUnsetAdmin = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("removeChannelAdmin", data, () => {
    chatStore.setCurrentChat(chatStore.currentChat);
  });
};

const handleKickUser = (username: string) => {
  const data = {
    channelId: chatStore.currentChatId,
    username,
  };
  chatSocket.emit("kickUser", data, () => {
    chatStore.setCurrentChat(chatStore.currentChat);
  });
};
</script>

<template>
  <div v-if="currentChat" class="flex overflow-hidden flex-col items-center border-card full p-4 space-y-2">
    <MModalProfile v-if="!!userProfile" :user="userProfile" @clickClose="userProfile = null" />
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
              <span v-if="member?.isChannelAdmin" class="badge badge-sm font-bold badge-primary">Admin</span>
            </summary>
            <div class="join join-vertical w-full">
              <AButton
                class="btn-sm join-item flex justify-start"
                text="Profile"
                icon="md-person"
                @click.prevent="handleOpenProfile(member.username)"
              />
              <AButton
                v-if="currentChat?.type === 'group' && member.id !== meStore.data?.id"
                class="btn-sm join-item flex justify-start"
                text="Private Message"
                icon="md-message"
                @click="handlePrivateMessage(member.username)"
              />
              <AButton
                v-if="currentChat?.type === 'group' && member.id !== meStore.data?.id"
                class="btn-sm join-item flex justify-start"
                text="Block"
                icon="md-block"
                @click="handleClickBlock(member.username)"
              />
            </div>
            <div v-if="showAdminOptions(member)">
              <div class="divider my-0 mx-2" />
              <div class="join join-vertical w-full">
                <AButton
                  v-if="!member.isChannelAdmin && currentChat?.owner?.id === meStore.data?.id"
                  class="btn-sm join-item flex justify-start"
                  text="Set as Admin"
                  icon="md-adminpanelsettings"
                  @click="handleSetAdmin(member.username)"
                />
                <AButton
                  v-else-if="currentChat?.owner?.id === meStore.data?.id"
                  class="btn-sm join-item flex justify-start"
                  text="Unset as Admin"
                  icon="md-adminpanelsettings"
                  @click="handleUnsetAdmin(member.username)"
                />
                <AButton
                  class="btn-sm join-item flex justify-start"
                  text="Kick"
                  icon="md-block"
                  @click="handleKickUser(member.username)"
                />
              </div>
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
