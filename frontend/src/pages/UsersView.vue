<script setup lang="ts">
import { ref, onMounted } from "vue";

import { api } from "@/routes/apiRouter";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import CardDetailUser from "@/components/molecules/CardDetailUser.vue";
import type { iUser } from "@/types/props";

const appStore = useAppStore();
const userStore = useUserStore();

const users = ref([] as iUser[]);

async function fetchUsers(tab: string) {
  let res: Response | null = null;

  if (tab === "all") res = await api.getAllUsers();
  if (tab === "blocked") res = await api.getAllBlockedUsers();
  if (tab === "friends") res = await api.getAllFriends();

  const users = (await res?.json()) as iUser[];
  return users.sort((a, b) => a.username.localeCompare(b.username));
}

async function handleBlock(username: string) {
  const res =
    appStore.tab === "blocked"
      ? await api.unblockUser(username)
      : await api.blockUser(username);

  const message = appStore.tab === "blocked" ? "Unblocked" : "Blocked";

  if (res?.ok) {
    users.value = users.value.filter((user) => user.username !== username);
    appStore.changeMessageLog(`Successfully ${message} ${username}`);
  } else appStore.changeMessageLog(`Failed to ${message} ${username}`);
}

async function handleAddFriend(username: string) {
  const message = appStore.tab === "friends" ? "Unfriended" : "Added";

  const res =
    appStore.tab === "friends"
      ? await api.unfriend(username)
      : await api.addFriend(username);

  if (appStore.tab === "friends")
    users.value = users.value.filter((user) => user.username !== username);

  if (res?.ok) {
    appStore.changeMessageLog(`Successfully ${message} ${username}`);
  } else {
    appStore.changeMessageLog(
      `Failed to ${message} ${username}, maybe you are already friends?`
    );
  }
}

async function handleChangeTab(tab: string) {
  users.value = await fetchUsers(tab);
  appStore.changetab(tab);
}

onMounted(async () => {
  users.value = await fetchUsers(appStore.tab);
});
</script>

<template>
  <div class="mfull p-10">
    <div class="mborder h-full p-5 mflex-col gap-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <ul class="flex gap-1">
        <button
          v-for="tab in ['all', 'friends', 'blocked']"
          :class="`btn btn-sm ${appStore.tab === tab && 'btn-primary'}`"
          @click="handleChangeTab(tab)"
        >
          {{ tab }}
        </button>
      </ul>
      <ul class="overflow-y-auto grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <li
          v-for="user in users"
          :key="user.intraId"
          class="flex flex-col gap-2 mborder p-5 items-center"
        >
          <CardDetailUser :url="user.avatarUrl" :name="user.username" />
          <div
            v-if="userStore.meData.username !== user.username"
            class="join w-full"
          >
            <button
              v-if="appStore.tab !== 'blocked'"
              class="mbtn-tab btn-primary"
              @click="handleAddFriend(user.username)"
            >
              {{ appStore.tab === "friends" ? "Unfriend" : "Add friend" }}
            </button>
            <button
              class="mbtn-tab btn-secondary"
              @click="handleBlock(user.username)"
            >
              {{ appStore.tab === "blocked" ? "Unblock" : "Block" }}
            </button>
          </div>
          <div v-else class="join w-full">
            <button
              class="mbtn-tab btn-primary"
              @click="$router.push({ name: 'profile' })"
            >
              See your profile
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
