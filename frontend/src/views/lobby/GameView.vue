<script setup lang="ts">
import PFive from "p5";
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { Paddle } from "@/util/paddle"
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

    let player: Paddle
    p5.setup = function () {
      p5.createCanvas(sizeScreen.x, sizeScreen.y).parent("game")
      player = new Paddle(26, p5.height / 2, p5.height)
    };

    function displayPaddle(paddle: Paddle) {
    p5.stroke(255)
    p5.rect(paddle.x, paddle.y, paddle.width, paddle.height)
    };

    p5.keyPressed = () => {
      if (p5.keyCode === p5.UP_ARROW) {
        player.isUp = true
      } else if (p5.keyCode === p5.DOWN_ARROW) {
        player.isDown = true
      }
    }

    p5.keyReleased = () => {
      if (p5.keyCode === p5.UP_ARROW) {
        player.isUp = false
      } else if(p5.keyCode === p5.DOWN_ARROW) {
        player.isDown = false
      }
    }

    p5.draw = function () {
      p5.background(0)
      displayPaddle(player)
      player.update()
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
