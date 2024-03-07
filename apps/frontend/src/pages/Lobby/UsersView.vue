<script setup lang="ts">
import type { iUser } from "@/types/props";
import { api } from "@/routes/apiRouter";

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
  const res = appStore.tab === "blocked" ? await api.unblockUser(username) : await api.blockUser(username);

  const message = appStore.tab === "blocked" ? "Unblocked" : "Blocked";

  if (res?.ok) {
    users.value = users.value.filter((user) => user.username !== username);
    appStore.changeMessageLog(`Successsize-fully ${message} ${username}`);
  } else {
    appStore.changeMessageLog(`Failed to ${message} ${username}`);
  }
}

async function handleClickFriendshipAction(user: iUser) {
  let message = "added";
  if (user.isFriendsWith) {
    message = "unfriended";
    const res = await api.unfriend(user.username);
    if (!res.ok) {
      appStore.changeMessageLog(`Failed to unfriend ${user.username}`);
      return;
    }
  } else {
    const res = await api.addFriend(user.username);
    if (!res.ok) {
      appStore.changeMessageLog(`Failed to add friend ${user.username}`);
      return;
    }
  }
  appStore.changeMessageLog(`Successsize-fully ${message} ${user.username}`);
  const index = users.value.findIndex((u) => u.username === user.username);
  users.value[index].isFriendsWith = !user.isFriendsWith;
}

async function handleTabChange() {
  users.value = await fetchUsers(appStore.tab);
}

onMounted(handleTabChange);
</script>

<template>
  <div class="size-full card-padding">
    <div class="size-full column separate md:border-card">
      <MTabSelectUsers @clickTab="handleTabChange" />
      <MModalProfile v-if="detailProfile.username" :user="detailProfile" @clickClose="detailProfile = {} as iUser" />
      <ul class="overflow-y-auto grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <MCardUser
          v-for="(user, key) in users"
          :user="user"
          :key="key"
          @handleSendMessage="handleClickSendMessage"
          @handleBlock="handleClickBlock"
          @handleFriendship="handleClickFriendshipAction"
          @showProfile="detailProfile = user"
        />
      </ul>
    </div>
  </div>
</template>
