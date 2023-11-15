<template>
  <canvas
    ref="canvasElement"
    class="border-2 border-neutral w-full h-full"
    height="1000"
    width="1000"
  ></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";

const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();

onMounted(() => {});
</script>
