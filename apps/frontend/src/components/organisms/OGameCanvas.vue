<script setup lang="ts">
import type { iGame } from "@/types/props";

defineProps<{ game: iGame }>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const ctx = canvasRef.value?.getContext("2d");

  if (!ctx) {
    console.error("Where's the context?");
    return;
  }
});
</script>

<template>
  <canvas id="pong" ref="canvasRef" class="aspect-[4/3] bg-base-200 w-[var(--canvas-width)]"></canvas>
</template>
