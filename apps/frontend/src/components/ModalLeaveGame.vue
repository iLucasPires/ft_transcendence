<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { useMeStore } from "@/stores/meStore";

const meStore = useMeStore();
const appStore = useAppStore();
</script>

<template>
  <dialog
    id="modalLeaveGame"
    class="modal modal-open"
    v-if="appStore && appStore.modalLeaveGame"
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
          v-on:click="
            () => {
              meStore.status.isGame = false;
              appStore.gameP5Instance?.remove();
              appStore.changeModalLeaveGame();
            }
          "
          v-text="'Leave game'"
        />
      </div>
    </div>
  </dialog>
</template>
