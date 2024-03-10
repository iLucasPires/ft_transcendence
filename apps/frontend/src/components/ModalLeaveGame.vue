<script setup lang="ts">
import router from "@/routes/vueRouter";
import { gameSocket } from "@/socket";

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
            gameSocket.emit('leaveGame');
            meStore.status.inGame = false;
            appStore.changeModalLeaveGame();
            router.push({ name: appStore.leaveGameTo });
          "
        >
          Leave game
        </button>
      </div>
    </div>
  </dialog>
</template>
