<script setup lang="ts">
import PFive from "p5";
import { onMounted, onUnmounted, ref, type Ref } from "vue";

import Player from "@/util/player";

const pFiveRef = ref<PFive | null>(null);
const playerRef = ref<Player | null>(null);
const gameRef: Ref<HTMLElement | null> = ref(null);

onUnmounted(function () {
  pFiveRef.value?.remove();
  playerRef.value?.stop();
  playerRef.value = null;
});

onMounted(function () {
  pFiveRef.value = new PFive(function (p5: PFive) {
    const sizeScreen: PFive.Vector = p5.createVector(
      gameRef.value?.clientWidth || 0,
      gameRef.value?.clientHeight || 0
    );

    p5.setup = function () {
      playerRef.value = new Player(p5);
      p5.createCanvas(sizeScreen.x, sizeScreen.y)
        .parent("game")
        .mouseOut(() => {
          playerRef.value?.stop();
        });
    };

    p5.draw = function () {
      p5.background(0);
      playerRef.value?.draw();
      playerRef.value?.handleInput();
    };

    p5.keyPressed = function () {
      playerRef.value?.updateDirection(p5.keyCode, true);
    };

    p5.keyReleased = function () {
      playerRef.value?.updateDirection(p5.keyCode, false);
    };
  });
});
</script>

<template>
  <div class="h-full w-full flex flex-col p-10">
    <h1 class="text-2xl font-bold mb-5">Game</h1>
    <div
      id="game"
      class="h-full w-full flex justify-center items-center"
      ref="gameRef"
    ></div>
  </div>
</template>
