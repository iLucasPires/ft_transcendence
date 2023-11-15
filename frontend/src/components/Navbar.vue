<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ref } from "vue";

const isOpen = ref(false);
</script>

<template>
  <button
    @click="() => (isOpen = !isOpen)"
    class="absolute h-20 bottom-2/3 rounded z-20"
    :class="isOpen ? '-left-4 border-2 border-primary ' : 'left-20 bg-primary '"
  >
    <v-icon
      scale="2"
      name="bi-arrow-left-short"
      class="text-slate-300"
      :class="isOpen && 'rotate-180 text-primary'"
    />
  </button>
  <aside :class="isOpen ? 'hidden' : 'flex'">
    <RouterLink to="/lobby">
      <v-icon scale="3" name="gi-forward-field" class="text-slate-300" />
    </RouterLink>
    <div>
      <nav>
        <ul class="flex flex-col gap-5">
          <li>
            <RouterLink class="btn flex-1" to="/lobby/game">
              <v-icon
                scale="1"
                name="io-game-controller"
                class="text-slate-300"
              />
            </RouterLink>
          </li>
          <li>
            <RouterLink class="btn flex-1" to="/lobby/game">
              <v-icon
                scale="1"
                name="io-chatbubbles-sharp"
                class="text-slate-300 flex-1"
              />
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
aside {
  @apply w-32 h-full p-5 z-10 absolute md:relative;
  @apply flex-col justify-between bg-primary items-center;
}
</style>
