<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";

import api from "@/routes/apiRouter";
import type { iUser } from "@/types/props";
import CardDetailUser from "@/components/molecules/CardDetailUser.vue";
import { useAppStore } from "@/stores/appStore";

const users: Ref<iUser[]> = ref([]);
const appStore = useAppStore();

onMounted(async () => {
  const res = await api.getAllUsers();
  users.value = await api.handleResponseToJson(res);
});

async function handleBlock(username: script) {
  let res = null;

  if (appStore.tabSelected === "blocked") res = await api.unblockUser(username);
  if (appStore.tabSelected === "all") res = await api.blockUser(username);

  if (res.ok) {
    users.value = users.value.filter((user) => user.username !== username);
  }
  if (!res.ok) {
    const error = await api.handleResponseToJson(res);
    appStore.changeStatusErro(error.message);
  }
}

async function handleChangeTab(tab: string) {
  let res = null;

  if (tab === "all") res = await api.getAllUsers();
  if (tab === "blocked") res = await api.getAllBlockedUsers();

  users.value = await api.handleResponseToJson(res);
  appStore.changeTabSelected(tab);
}
</script>

<template>
  <div class="mfull p-10">
    <div class="mborder h-full p-5 mflex-col gap-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <ul class="flex gap-2">
        <button
          v-for="(tab, index) in ['all', 'friends', 'blocked']"
          class="btn btn-sm"
          :class="{ 'btn-primary': appStore.tabSelected === tab }"
          :key="tab"
          @click="handleChangeTab(tab)"
        >
          {{ tab }}
        </button>
      </ul>

      <ul class="overflow-y-auto flex flex-row gap-2">
        <li
          v-for="user in users"
          :key="user.intraId"
          class="flex flex-col gap-2 mborder p-5 items-center"
        >
          <CardDetailUser
            :url="user.avatarUrl"
            :name="user.username"
            :wins="10"
            :losses="5000"
          />
          <div class="join w-full rounded mborder">
            <button class="flex-1 btn btn-primary join-item">Add friend</button>
            <button
              @click="handleBlock(user.username)"
              class="flex-1 btn btn-secondary join-item"
            >
              {{ appStore.tabSelected === "blocked" ? "Unblock" : "Block" }}
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
