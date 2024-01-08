<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "./stores/userStore";

const userStore = useUserStore();
const appStore = useAppStore();

function handleClickLeaveGame() {
  userStore.status.isGame = false;
  appStore.gameP5?.remove();
  appStore.closeModalLeaveGame();
}

function handleClickBackToGame() {
  appStore.closeModalLeaveGame();
}

onMounted(() => {
  appStore.setThemeGlobal();
  appStore.setModalLeaveGame();
});
</script>
<template>
  <!-- Notification -->
  <div v-if="appStore.log" class="absolute bottom-4 right-4 z-50">
    <div role="alert" class="alert alert-info shadow-lg">
      <Icon name="md-crisisalert" />
      <span v-text="appStore.log" />
    </div>
  </div>

  <!-- modal Leave Game  -->
  <dialog id="modalLeaveGame" class="modal">
    <div class="modal-box">
      <h3 class="title" v-text="'Leave Game'" />
      <p class="py-4" v-text="'Are you sure you want to leave the game?'" />
      <div class="flex w-full gap-2">
        <button
          class="btn-full btn-primary"
          v-bind:class="item.color"
          v-on:click="item.onClick"
          v-text="item.text"
          v-for="item in [
            {
              text: 'Back to game',
              color: 'btn-primary',
              onClick: handleClickBackToGame,
            },
            {
              text: 'Leave game',
              color: 'btn-secondary',
              onClick: handleClickLeaveGame,
            },
          ]"
        />
      </div>
    </div>
  </dialog>

  <!-- router view  -->
  <RouterView />
</template>
