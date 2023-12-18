<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import api from "@/routes/apiRouter";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import type { iUser } from "@/types/props";
import CardDetailUser from "@/components/molecules/CardDetailUser.vue";
import { router } from "@/routes/vueRouter";

const appStore = useAppStore();
const userStore = useUserStore();

const users = ref([] as iUser[]);
const res = ref(null as Response | null);
const selectedTab = computed(() => appStore.tabSelected);

const fetchUsers = async (tab: string) => {
  if (tab === "all") res.value = await api.getAllUsers();
  if (tab === "blocked") res.value = await api.getAllBlockedUsers();
  if (tab === "friends") res.value = await api.getAllFriends();

  const users = await api.handleResponseToJson(res.value as Response) as iUser[];
  return users.sort((a, b) => a.username.localeCompare(b.username));
};

function removeUser(username: string) {
  users.value = users.value.filter((user) => user.username !== username);
}

async function handleApiError(res: Response | null) {
  if (!res?.ok) {
    const error = await api.handleResponseToJson(res as Response);
    appStore.changeMessageLog(error.message);
  }
}

async function handleBlock(username: string) {
  if (selectedTab.value === "blocked")
    res.value = await api.unblockUser(username);
  else res.value = await api.blockUser(username);

  if (res.value?.ok) removeUser(username);
  else handleApiError(res.value);
}

async function handleAddFriend(username: string) {
  if (selectedTab.value === "friends") {
    res.value = await api.unfriend(username);
    removeUser(username);
  } else if (selectedTab.value === "all")
    res.value = await api.addFriend(username);

  if (res.value?.ok) appStore.changeMessageLog("Friend added");
  else handleApiError(res.value);
}

onMounted(async () => {
  users.value = await fetchUsers(selectedTab.value);
});

async function handleChangeTab(tab: string) {
  users.value = await fetchUsers(tab);
  appStore.changeTabSelected(tab);
}

function getButtonClass(tab: string) {
  return {
    "btn btn-sm": true,
    "btn-primary": selectedTab.value === tab,
  };
}

function getTextByLeftButton(tab: string) {
  if (tab === "friends") return "Unfriend";
  if (tab === "blocked") return "Unblock";

  return "Add friend";
}

function getTextByRightButton(tab: string) {
  if (tab === "blocked") return "Unblock";
  return "Block";
}
</script>

<template>
  <div class="mfull p-10">
    <div class="mborder h-full p-5 mflex-col gap-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <ul class="flex gap-1">
        <button
          v-for="tab in ['all', 'friends', 'blocked']"
          @click="handleChangeTab(tab)"
          :class="getButtonClass(tab)"
          :key="tab"
        >
          {{ tab }}
        </button>
      </ul>

      <ul class="overflow-y-auto flex lg:flex-row flex-col gap-2">
        <li
          v-for="user in users"
          :key="user.intraId"
          class="flex flex-col gap-2 mborder p-5 items-center"
        >
          <CardDetailUser :url="user.avatarUrl" :name="user.username" />
          <div
            v-if="userStore.meData.username !== user.username"
            class="join w-full rounded mborder"
          >
            <button
              v-if="selectedTab !== 'blocked'"
              @click="handleAddFriend(user.username)"
              class="mbtn-tab btn-primary"
            >
              {{ getTextByLeftButton(selectedTab) }}
            </button>
            <button
              @click="handleBlock(user.username)"
              class="mbtn-tab btn-secondary"
            >
              {{ getTextByRightButton(selectedTab) }}
            </button>
          </div>
          <div v-else class="join w-full rounded mborder">
            <button
              @click="() => router.push({ name: 'profile' })"
              class="mbtn-tab btn-primary"
            >
             See your profile
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
