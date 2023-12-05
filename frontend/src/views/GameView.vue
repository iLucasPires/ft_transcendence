<script setup lang="ts">
import PFive from "p5";
import { onUnmounted, ref } from "vue";
import type { Ref } from "vue";
import { Paddle } from "@/util/paddle";
import { Ball } from "@/util/ball";
import { Player } from "@/util/player";
import { Player2 } from "@/util/player2";
import useStore from "@/store";

const store = useStore();
const gameRef: Ref<HTMLElement | null> = ref(null);

onUnmounted(function () {
  store.gameData?.remove();
});

function startGame() {
  store.gameData = new PFive(function (p5: PFive) {
    const sizeScreen: PFive.Vector = p5.createVector(
      gameRef.value?.clientWidth || 0,
      gameRef.value?.clientHeight || 0
    );

    let player: Player;
    let player2: Player2;
    let ball: Ball;
    p5.setup = function () {
      p5.createCanvas(sizeScreen.x, sizeScreen.y).parent("game");
      player = new Player(26, p5.height / 2, p5.height);
      player2 = new Player2(p5.width - 48, p5.height / 2, p5.height);
      ball = new Ball(p5.width, p5.height);
    };

    function displayPaddle(paddle: Paddle) {
      p5.stroke(255);
      p5.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    p5.keyPressed = () => {
      if (p5.keyCode === p5.UP_ARROW) {
        player.isUp = true;
      } else if (p5.keyCode === p5.DOWN_ARROW) {
        player.isDown = true;
      }
    };

    p5.keyReleased = () => {
      if (p5.keyCode === p5.UP_ARROW) {
        player.isUp = false;
      } else if (p5.keyCode === p5.DOWN_ARROW) {
        player.isDown = false;
      }
    };

    function displayBall(ball: Ball) {
      p5.stroke(255);
      p5.ellipse(ball.x, ball.y, ball.radius * 2, ball.radius * 2);
    }

    function handleColision(player: Paddle, player2: Paddle, ball: Ball) {
      if (player.wasReachedBy(ball)) {
        ball.changeDirection();
      } else if (player2.wasReachedBy(ball)) {
        ball.changeDirection();
      }
    }

    p5.draw = function () {
      p5.background(0);
      displayPaddle(player);
      displayPaddle(player2);
      displayBall(ball);
      player.update();
      ball.update();
      handleColision(player, player2, ball);
    };
  });
}

function handleClickStartGame() {
  startGame();
  store.changeStatusGame();
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
          v-if="!store.status.isGame"
          class="btn btn-primary"
          @click="handleClickStartGame()"
        >
          Start Game
        </button>
      </div>
    </div>
  </div>
</template>
