<script setup lang="ts">
import { scaleCanvas, updateGameCanvas } from "@/lib/gameCanvas";
import { gameSocket } from "@/socket";
import type { iGame, iGameState } from "@/types/props";

defineProps<{ game: iGame; map: "classic" | "soccer" | "tennis-green" | "tennis-orange" }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasCtx = computed(() => canvasRef.value?.getContext("2d"));
const gameState = ref<iGameState>({
  score: { leftPlayer: 0, rightPlayer: 0 },
  leftPlayerY: 270,
  rightPlayerY: 270,
  ballPosition: { x: 400, y: 300 },
});

const handleResize = () => {
  const ctx = canvasCtx.value;
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;

  if (!ctx || !canvas || !wrapper) {
    return;
  }
  scaleCanvas(canvas, wrapper);
  updateGameCanvas(ctx, gameState.value);
};

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.code === "ArrowUp" || e.code === "ArrowDown") {
    gameSocket.emit("keyPress", e.code);
  }
};

const handleKeyRelease = (e: KeyboardEvent) => {
  if (e.code === "ArrowUp" || e.code === "ArrowDown") {
    gameSocket.emit("keyRelease", e.code);
  }
};

onMounted(() => {
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;

  if (!canvas || !wrapper) {
    return;
  }
  const ctx = canvasCtx.value!;
  scaleCanvas(canvas, wrapper);
  updateGameCanvas(ctx, gameState.value);
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleKeyPress);
  window.addEventListener("keyup", handleKeyRelease);
  gameSocket.on("gameTick", (state: iGameState) => {
    gameState.value = state;
    updateGameCanvas(ctx, state);
  });
  gameSocket.emit("playerReady");
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", handleKeyPress);
  window.removeEventListener("keyup", handleKeyRelease);
  gameSocket.removeListener("gameTick");
});
</script>

<template>
  <div ref="wrapperRef" class="aspect-4/3 relative w-[var(--canvas-width)]">
    <div class="absolute z-40 top-0 left-0 p-4 flex items-center justify-around w-full select-none">
      <div class="flex flex-1 items-center gap-4">
        <img
          class="size-10 rounded-full bg-base-200"
          :src="game.leftPlayer.avatarUrl ?? `https://robohash.org/${game.leftPlayer.username}.png`"
          :alt="`avatar of ${game.leftPlayer.username}`"
        />
        <span class="font-bold text-lg text-primary">{{ game.leftPlayer.username }}</span>
      </div>
      <span class="font-bold text-2xl">{{ gameState.score.leftPlayer }}</span>
      <span class="w-16" />
      <span class="font-bold text-2xl">{{ gameState.score.rightPlayer }}</span>
      <div class="flex flex-1 justify-end items-center gap-4">
        <span class="font-bold text-lg text-primary">{{ game.rightPlayer.username }}</span>
        <img
          class="size-10 rounded-full bg-base-200"
          :src="game.rightPlayer.avatarUrl ?? `https://robohash.org/${game.rightPlayer.username}.png`"
          :alt="`avatar of ${game.rightPlayer.username}`"
        />
      </div>
    </div>
    <canvas id="pong" ref="canvasRef" class="absolute size-full top-0 z-30"></canvas>
    <div class="absolute size-full top-0 z-20">
      <img :src="`/maps/${map}.png`" />
    </div>
  </div>
</template>
