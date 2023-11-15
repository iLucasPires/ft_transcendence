<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

#app {
  width: 100vw;
  height: 100vh;
}

::-webkit-scrollbar {
  width: 10px;
  padding: 10px;
}

::-webkit-scrollbar-track {
  background: #535353;
}

::-webkit-scrollbar-thumb {
  background: #888;
}
</style>
