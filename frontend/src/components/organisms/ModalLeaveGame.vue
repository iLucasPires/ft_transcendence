<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";

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
</script>

<template>
  <dialog id="modalLeaveGame" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Warning</h3>
      <p class="py-4">
        You are currently in a game, if you leave you will lose the game.
      </p>
      <div class="modal-action">
        <form method="dialog">
          <div class="join">
            <button
              class="btn join-item btn-neutral"
              @click="handleClickBackToGame"
            >
              Back to game
            </button>
            <button
              class="btn join-item btn-primary"
              @click="handleClickLeaveGame"
            >
              get out
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
