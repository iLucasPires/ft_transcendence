<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { useMeStore } from "@/stores/meStore";

const meStore = useMeStore();
const appStore = useAppStore();
</script>

<template>
  <dialog id="modalLeaveGame" class="modal modal-open" v-if="appStore && appStore.modalLeaveGame">
    <div class="modal-box">
      <h3 class="title">Leave Game</h3>
      <p class="py-4">Are you sure you want to leave the game?</p>
      <div class="flex w-full gap-2">
        <button class="btn-full btn-primary" v-on:click="appStore.changeModalLeaveGame">Back to game</button>
        <button
          class="btn-full btn-secondary"
          v-on:click="
            meStore.status.isGame = false;
            appStore.gameP5Instance?.remove();
            appStore.changeModalLeaveGame();
          "
        >
          Leave game
        </button>
      </div>
    </div>
  </dialog>
</template>
