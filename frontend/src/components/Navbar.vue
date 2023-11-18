<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <aside class="">
    <RouterLink to="/lobby">
      <v-icon scale="3" name="gi-forward-field" class="text-accent" />
    </RouterLink>
    <div>
      <nav>
        <ul class="flex flex-col gap-5">
          <li>
            <RouterLink class="btn flex-1" to="/lobby/game">
              <v-icon scale="1" name="io-game-controller" />
            </RouterLink>
          </li>
          <li>
            <RouterLink class="btn flex-1" to="/lobby/game">
              <v-icon scale="1" name="io-chatbubbles-sharp" />
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
aside {
  @apply w-20 h-full p-5 z-10 absolute md:relative;
  @apply flex flex-col justify-between items-center;
  @apply flex-col justify-between bg-primary items-center;
}
</style>
