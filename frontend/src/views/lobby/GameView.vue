<template>
  <main class="h-full w-full flex justify-center items-center">
    <div class="w-4/5 h-4/5">
      <canvas
        ref="canvasElement"
        class="border-2 border-neutral h-full w-full"
        height="1000"
        width="1000"
      ></canvas>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";

const canvasElement: Ref<HTMLCanvasElement | undefined> = ref();

</script>
