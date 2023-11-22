<script setup lang="ts">
import { ref, type Ref } from "vue";
import { RouterLink } from "vue-router";
import Typography from "./Typography.vue";
import ItemNavBar from "./ItemNavBar.vue";

const isMenuOpen: Ref<boolean> = ref(true);
</script>

<template>
  <aside
    :class="{ 'w-64': isMenuOpen, 'w-24': !isMenuOpen }"
    class="p-5 flex flex-col bg-base-300 transition-all duration-300"
  >
    <div class="container-center-row gap-2 w-full">
      <Icon
        scale="1.5"
        name="md-keyboarddoublearrowleft"
        :class="{ 'transform -rotate-180': isMenuOpen }"
        @click="isMenuOpen = !isMenuOpen"
      />
    </div>
    <nav class="flex flex-col flex-1 justify-between mt-10">
      <ul class="flex flex-col gap-2">
        <ItemNavBar
          v-for="item in [
            { url: '/lobby/game', icon: 'io-game-controller', text: 'Game' },
            {
              url: '/lobby/friends',
              icon: 'io-chatbubbles-sharp',
              text: 'Friends',
            },
            {
              url: '/lobby/history',
              icon: 'md-workhistory-round',
              text: 'History',
            },
          ]"
          :key="item.url"
          :isMenuOpen="isMenuOpen"
          :url="item.url"
          :icon="item.icon"
        >
          {{ item.text }}
        </ItemNavBar>
      </ul>
    </nav>
    <ItemNavBar
      type="button"
      :isMenuOpen="isMenuOpen"
      url="/lobby/profile"
      icon="io-chatbubbles-sharp"
      text="Logout"
    >
      Logout
    </ItemNavBar>
  </aside>
</template>
