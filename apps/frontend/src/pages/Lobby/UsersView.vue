<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { api } from "@/routes/apiRouter";
import { useAppStore } from "@/stores/appStore";
import { useChatStore } from "@/stores/chatStore";
import type { iUser } from "@/types/props";

const appStore = useAppStore();
const chatStore = useChatStore();

const users = ref([] as iUser[]);
const detailProfile = ref({} as iUser);

async function fetchUsers(tab: string) {
  const apiMethod = {
    all: api.getAllUsers,
    blocked: api.getAllBlockedUsers,
    friends: api.getAllFriends,
  }[tab];

  const res = apiMethod ? await apiMethod() : await api.getAllUsers();
  const users = (await res.json()) as iUser[];
  return users.sort((a, b) => a.username.localeCompare(b.username));
}

async function handleClickSendMessage(username: string) {
  chatStore.openDmChat(username);
}

async function handleClickBlock(username: string) {
  const res = appStore.tab === "blocked" 
    ? await api.unblockUser(username) 
    : await api.blockUser(username);

  const message = appStore.tab === "blocked" ? "Unblocked" : "Blocked";

  if (res?.ok) {
    users.value = users.value.filter((user) => user.username !== username);
    appStore.changeMessageLog(`Successfully ${message} ${username}`);
  } else {
    appStore.changeMessageLog(`Failed to ${message} ${username}`);
  }
}

async function handleClickAddFriend(username: string) {
  const message = appStore.tab === "friends" ? "Unfriended" : "Added";

  const res = appStore.tab === "friends" 
    ? await api.unfriend(username) 
    : await api.addFriend(username);

  if (res?.ok) {
    appStore.changeMessageLog(`Successfully ${message} ${username}`);

    if (appStore.tab === "friends") {
      users.value = users.value.filter((user) => user.username !== username);
    }

    if (appStore.tab === "all") {
      users.value[users.value.findIndex((user) => user.username === username)].isFriendsWith = true;
    }
  } else {
    appStore.changeMessageLog(`Failed to ${message} ${username}, maybe you are already friends?`);
  }
}

async function handleTabChange() {
  users.value = await fetchUsers(appStore.tab);
}

onMounted(handleTabChange);
</script>

<template>
  <div class="full card-padding">
    <div class="full column separate md:border-card">
      <MTabSelectUsers @clickTab="handleTabChange" />
      <MModalProfile v-if="detailProfile.username" :user="detailProfile" @clickClose="detailProfile = {} as iUser" />
      <ul class="overflow-y-auto grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <MCardUser
          v-for="(user, key) in users"
          :user="user"
          :key="key"
          @handleSendMessage="handleClickSendMessage"
          @handleBlock="handleClickBlock"
          @handleAdd="handleClickAddFriend"
          @showProfile="detailProfile = user"
        />
      </ul>
    </div>
  </div>
</template>
