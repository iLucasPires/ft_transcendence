<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";

import History from "@/components/molecules/CardHistoryUser.vue";
import CardDetailUser from "@/components/molecules/CardDetailUser.vue";

const appStore = useAppStore();
const userStore = useUserStore();
</script>

<template>
  <div
    class="mflex-col overflow-hidden items-center w-full gap-5 p-10 relative"
  >
 
    <CardDetailUser
      class="w-full"
      :url="userStore.meData?.avatarUrl ?? ''"
      :name="userStore.meData?.username"
      :wins="10"
      :losses="5"
    />

    <History class="mfull" />
  </div>
</template>
