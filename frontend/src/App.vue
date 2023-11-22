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

li {
  list-style: none;
}

.container-flex-col {
  @apply flex flex-col items-center justify-center;
}

.container-flex-row {
  @apply flex flex-row items-center justify-center;
}

.container-center-row {
  @apply flex items-center justify-center;
}

.container-center-col {
  @apply flex flex-col items-center justify-center;
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
</style>
