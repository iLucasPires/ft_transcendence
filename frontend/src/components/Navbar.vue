<script setup lang="ts">
import { ref, type Ref } from "vue";
import ItemNavBar from "./ItemNavBar.vue";
import UseTheme from "@/stores/themeStore";
import UseUser from "@/stores/userStore";

const themeStore = UseTheme();
const userStore = UseUser();
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
        :class="{ 'transform -rotate-180': !isMenuOpen }"
        @click="isMenuOpen = !isMenuOpen"
      />
    </div>
    <nav class="flex flex-col flex-1 justify-between mt-10">
      <ul>
        <RouterLink
          v-for="item in [
            { url: '/profile', icon: 'md-person', text: 'Profile' },
            { url: '/game', icon: 'io-game-controller', text: 'Game' },
            {
              url: '/friends',
              icon: 'io-chatbubbles-sharp',
              text: 'Friends',
            },
            {
              url: '/history',
              icon: 'md-workhistory-round',
              text: 'History',
            },
          ]"
          :to="item.url"
          :key="item.url"
        >
          <ItemNavBar
            :isMenuOpen="isMenuOpen"
            :url="item.url"
            :icon="item.icon"
          >
            {{ item.text }}
          </ItemNavBar>
        </RouterLink>
      </ul>
    </nav>
    <button class="w-full dropdown dropdown-right dropdown-end">
      <ItemNavBar type="span" :isMenuOpen="isMenuOpen" icon="md-settings">
        Settings
      </ItemNavBar>
      <ul
        class="dropdown-content w-52 z-10 mx-2 border-2 border-primary menu p-2 bg-base-100 rounded-box gap-2"
      >
        <ItemNavBar
          type="span"
          @click="themeStore.toggleTheme()"
          :icon="themeStore.isDarkTheme() ? 'md-lightmode' : 'md-nightlight'"
        >
          {{ themeStore.isDarkTheme() ? "Light Mode" : "Dark Mode" }}
        </ItemNavBar>
        <ItemNavBar
          @click="
            () => {
              userStore.logout();
              $router.push('/');
            }
          "
          type="span"
          icon="md-logout"
        >
          Logout
        </ItemNavBar>
      </ul>
    </button>
  </aside>
</template>
