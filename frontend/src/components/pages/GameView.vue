<script setup lang="ts">
import { onUnmounted, ref, type Ref } from "vue";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { startGame } from "@/utils/game";

const appStore = useAppStore();
const userStore = useUserStore();
const gameRef: Ref<HTMLElement | null> = ref(null);

onUnmounted(function () {
  appStore.gameP5?.remove();
});

function handleClickStartGame() {
  appStore.gameP5 = startGame(
    gameRef.value?.clientWidth ?? 0,
    gameRef.value?.clientHeight ?? 0
  );
  userStore.changeStatusGame();
}
</script>

<template>
  <div class="w-full h-full p-10">
    <div class="border-2 border-base-300 rounded h-full w-full p-5">
      <h1 class="text-2xl font-bold mb-5">Game</h1>
      <div
        id="game"
        ref="gameRef"
        class="flex justify-center items-center bg-base-300 w-full h-[94%]"
      >
        <button
          v-if="!userStore.status.isGame"
          class="btn btn-primary"
          @click="handleClickStartGame()"
        >
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>
