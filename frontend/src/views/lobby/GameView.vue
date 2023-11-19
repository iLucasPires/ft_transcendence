<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import P5, { Image } from 'p5'


let p5instance: P5

onMounted(() => {
  function sketch(p5: P5) {
    p5.preload = function () {
    }

    p5.setup = function () {
      p5.createCanvas(500, 500).parent("game")
      p5.background("white")
    }

    p5.draw = function () {
    }

    p5.keyPressed = function () {
    }

    p5.keyReleased = function () {
    }
  }
  p5instance = new P5(sketch)
})

onUnmounted(() => {
  p5instance.remove()

})

</script>

<template>
  <div id="game" class="h-full w-full flex justify-center items-center">

  </div>
</template>
