<script setup lang="ts">
import { scaleCanvas, updateGameCanvas } from "@/lib/gameCanvas";
import { gameSocket } from "@/socket";
import type { iGame, iGameState } from "@/types/props";

defineProps<{ game: iGame }>();

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
  <div ref="wrapperRef" class="aspect-4/3 bg-base-200 w-[var(--canvas-width)]">
    <canvas id="pong" ref="canvasRef" class="size-full"></canvas>
  </div>
</template>
