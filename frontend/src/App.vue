<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();
const appStore = useAppStore();

function handleClickLeaveGame() {
  userStore.status.isGame = false;
  appStore.gameP5Instance?.remove();
  appStore.changeModalLeaveGame();
}

onMounted(() => {
  appStore.setTheme();
});
</script>
<template>
  <!-- Notification -->
  <div v-if="appStore.log.length > 0">
    <ul class="column absolute bottom-4 right-4 z-50 gap-2">
      <li
        role="alert"
        class="alert shadow-lg border border-primary"
        v-for="item in appStore.log"
      >
        <Icon name="md-crisisalert" />
        <span v-text="item" />
      </li>
    </ul>
  </div>

  <!-- modal Leave Game  -->
  <dialog
    id="modalLeaveGame"
    class="modal modal-open"
    v-if="appStore.modalLeaveGame"
  >
    <div class="modal-box">
      <h3 class="title" v-text="'Leave Game'" />
      <p class="py-4" v-text="'Are you sure you want to leave the game?'" />
      <div class="flex w-full gap-2">
        <button
          class="btn-full btn-primary"
          v-on:click="appStore.changeModalLeaveGame"
          v-text="'Back to game'"
        />
        <button
          class="btn-full btn-secondary"
          v-on:click="handleClickLeaveGame"
          v-text="'Leave game'"
        />
      </div>
    </div>
  </dialog>

  <!-- router view  -->
  <RouterView />
</template>
