<script setup lang="ts">
import { ref, type Ref } from "vue";

import { router } from "@/routes/vueRouter";
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";

import ItemNavBar from "@/components/molecules/ItemNavBar.vue";

const userStore = useUserStore();
const { isDarkTheme, openModalLeaveGame, changeGlobalTheme } = useAppStore();
const menuOpen: Ref<boolean> = ref(true);

const menuList = [
  { url: "/game", icon: "io-game-controller", text: "Game" },
  { url: "/users", icon: "md-supervisoraccount", text: "Users" },
  { url: "/chat", icon: "io-chatbubbles-sharp", text: "Chat" },
];

function handleClickNav(url: string) {
  if (userStore.status.isGame) openModalLeaveGame();
  else router.push(url);
}
</script>

<template>
  <aside
    class="hover:w-64 w-24 h-screen p-5 flex-col bg-base-300 transition-all duration-300 hidden md:flex"
  >
    <a
      @click="handleClickNav('/')"
      :class="'/profile' === $route.path && 'text-primary'"
      class="text-center cursor-pointer font-bold"
    >
      <Icon name="gi-banana-bunch" scale="2" />
    </a>

    <nav class="flex flex-col flex-1 justify-between mt-10">
      <menu class="flex flex-col gap-2">
        <ItemNavBar
          v-for="item in menuList"
          :to="item.url"
          :key="item.url"
          :icon="item.icon"
          :menuOpen="menuOpen"
          :class="item.url === $route.path && 'btn-primary'"
          @click="handleClickNav(item.url)"
        >
          {{ item.text }}
        </ItemNavBar>
      </menu>
    </nav>

    <menu class="flex flex-col gap-2">
      <ItemNavBar
        @click="changeGlobalTheme()"
        :menuOpen="menuOpen"
        :icon="isDarkTheme ? 'md-nightlight' : 'md-lightmode'"
      >
        {{ isDarkTheme ? "Light" : "Dark" }}
      </ItemNavBar>
      <ItemNavBar
        @click="userStore.unsetMe()"
        :menuOpen="menuOpen"
        icon="md-logout"
      >
        Logout
      </ItemNavBar>
    </menu>
  </aside>
</template>
