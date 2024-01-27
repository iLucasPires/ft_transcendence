<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/stores/appStore";

import AlertNotification from "./components/AlertNotification.vue";
import ModalLeaveGame from "./components/ModalLeaveGame.vue";

const appStore = useAppStore();

onMounted(() => appStore.setTheme());
</script>

<template>
  <AlertNotification />
  <ModalLeaveGame />
  <RouterView />
</template>
