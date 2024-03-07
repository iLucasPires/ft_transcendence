<script setup lang="ts">
import { scaleCanvas, updateGameCanvas } from "@/lib/gameCanvas";
import type { iGame } from "@/types/props";

defineProps<{ game: iGame }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const canvasCtx = computed(() => canvasRef.value?.getContext("2d"));

const handleResize = () => {
  const ctx = canvasCtx.value;
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;

  if (!ctx || !canvas || !wrapper) {
    return;
  }
  scaleCanvas(canvas, wrapper);
  updateGameCanvas(ctx);
};

onMounted(() => {
  const canvas = canvasRef.value;
  const wrapper = wrapperRef.value;

  if (!canvas || !wrapper) {
    return;
  }
  const ctx = canvasCtx.value!;
  scaleCanvas(canvas, wrapper);
  updateGameCanvas(ctx);
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div ref="wrapperRef" class="aspect-4/3 bg-base-200 relative w-[var(--canvas-width)]">
    <canvas id="pong" ref="canvasRef" class="absolute size-full"></canvas>
  </div>
</template>
