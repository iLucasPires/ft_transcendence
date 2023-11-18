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

:root {
  --primary: #171717;
  --secondary: #333333;
}

* {
  scrollbar-width: thin;
  scrollbar-color: var(--secondary) var(--primary);
}

*::-webkit-scrollbar {
  width: 15px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  background: var(--primary);
  border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--secondary);
  border-radius: 14px;
  border: 3px solid var(--primary);
}

p {
  @apply text-slate-200;
}
</style>
