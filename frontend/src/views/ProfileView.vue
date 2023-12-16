<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";

import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";

const appStore = useAppStore();
const userStore = useUserStore();
</script>

<template>
  <div class="flex flex-col overflow-hidden items-center w-full gap-5 p-10">
    <button
      @click="() => appStore.openModalUpdateProfile()"
      class="btn btn-primary btn-sm absolute z-20 right-16 top-16"
    >
      <Icon name="md-modeedit" />
    </button>
    <div class="flex gap-5 p-5 w-full border-2 border-base-300 rounded">
      <UserDetail
        :url="userStore.meData?.avatarUrl ?? ''"
        :name="userStore.meData?.username"
        :wins="10"
        :losses="5"
      />
    </div>
    <div
      class="h-full w-full flex flex-col border-2 border-base-300 p-5 rounded overflow-auto"
    >
      <History />
    </div>
  </div>
</template>
