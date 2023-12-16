<script setup lang="ts">
import { ref, type Ref } from "vue";

import { router } from "@/routes/vueRouter";
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";

import ItemNavBar from "@/components/molecules/ItemNavBar.vue";

const userStore = useUserStore();
const appStore = useAppStore();
const menuOpen: Ref<boolean> = ref(true);

function handleClickNav(url: string) {
  if (userStore.status.isGame) appStore.openModalLeaveGame();
  else router.push(url);
}

const menuList = [
  { url: "/game", icon: "io-game-controller", text: "Game" },
  { url: "/users", icon: "md-person", text: "Users" },
  { url: "/chat", icon: "io-chatbubbles-sharp", text: "Chat" },
  { url: "/history", icon: "md-workhistory-round", text: "History" },
];
</script>

<template>
  <aside
    :class="{ 'w-64': menuOpen, 'w-24': !menuOpen }"
    class="p-5 flex flex-col bg-base-300 transition-all duration-300"
  >
    <a
      @click="handleClickNav('/')"
      class="text-2xl font-bold text-primary text-center cursor-pointer"
    >
      Pong
    </a>

    <nav class="flex flex-col flex-1 justify-between mt-10">
      <menu class="flex flex-col gap-2">
        <ItemNavBar
          v-for="item in menuList"
          :to="item.url"
          :key="item.url"
          :icon="item.icon"
          :menuOpen="menuOpen"
          @click="handleClickNav(item.url)"
        >
          {{ item.text }}
        </ItemNavBar>
      </menu>
    </nav>

    <menu class="flex flex-col gap-2">
      <ItemNavBar
        @click="appStore.openModalUpdateProfile()"
        :menuOpen="menuOpen"
        icon="md-settings"
      >
        Edit Profile
      </ItemNavBar>

      <ItemNavBar
        @click="menuOpen = !menuOpen"
        :invertIcon="!menuOpen"
        icon="md-keyboarddoublearrowleft"
      >
        Resize Menu
      </ItemNavBar>

      <ItemNavBar
        @click="appStore.changeGlobalTheme()"
        :menuOpen="menuOpen"
        :icon="appStore.isDarkTheme ? 'md-nightlight' : 'md-lightmode'"
      >
        {{ appStore.isDarkTheme ? "Light Mode" : "Dark Mode" }}
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
