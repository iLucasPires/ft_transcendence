<script setup lang="ts">
import { RouterLink } from "vue-router";
import { ref } from "vue";

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <button
    class="absolute bottom-2/3 rounded-box bg-primary z-10"
    :class="isOpen ? '-left-4' : 'left-20 '"
    @click="toggle"
  >
    <v-icon scale="2" name="bi-arrow-left-short" class="text-slate-300" />
  </button>
  <aside
    :class="isOpen ? 'hidden' : 'flex'"
    class="flex flex-col w-32 h-full justify-between bg-primary items-center p-5"
  >
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
