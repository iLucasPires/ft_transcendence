<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { startGame } from "@/utils/game";

const appStore = useAppStore();
const userStore = useUserStore();
const gameRef = ref<HTMLElement | null>(null);

onUnmounted(function () {
  appStore.gameP5Instance?.remove();
});

function handleClickStartGame() {
  appStore.gameP5Instance = startGame(
    gameRef.value?.clientWidth ?? 0,
    gameRef.value?.clientHeight ?? 0
  );
  userStore.changeStatusGame();
}
</script>

<template>
  <div class="full card-padding">
    <div class="md:border-card full column separate justify-center">
      <div
        id="game"
        ref="gameRef"
        class="center bg-base-300 w-full h-[94%] rounded"
      >
        <button
          v-if="!userStore.status.isGame"
          class="btn btn-primary hidden md:block"
          @click="handleClickStartGame()"
        >
          Start Game
        </button>
        <h2 class="md:hidden text-primary text-center">
          this game not support mobile
        </h2>
      </div>
    </div>
  </div>
</template>
