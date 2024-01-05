<script setup lang="ts">
import { onMounted } from "vue";

import Alert from "@/components/atoms/Alert.vue";
import Loading from "@/components/atoms/Loading.vue";
import ModalLeaveGame from "@/components/organisms/ModalLeaveGame.vue";
import ModalUpdateProfile from "@/components/organisms/ModalUpdateProfile.vue";

import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();

onMounted(() => {
  appStore.setThemeGlobal();
  appStore.setModalLeaveGame();
});
</script>

<template>
  <Alert />
  <Loading />
  <ModalUpdateProfile />
  <ModalLeaveGame />
  <RouterView />
</template>
