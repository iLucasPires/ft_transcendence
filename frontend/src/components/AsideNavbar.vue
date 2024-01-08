<script setup lang="ts">
import { router } from "@/routes/vueRouter";
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";

const userStore = useUserStore();
const appStore = useAppStore();

const menuList = [
  { url: "/profile", icon: "md-person", text: "Profile" },
  { url: "/users", icon: "md-supervisoraccount", text: "Users" },
  { url: "/game", icon: "io-game-controller", text: "Game" },
  { url: "/chat", icon: "io-chatbubbles-sharp", text: "Chat" },
];

function handleClickNav(url: string) {
  if (userStore.status.isGame) appStore.openModalLeaveGame();
  else router.push(url);
}
</script>

<template>
  <aside
    class="separate column w-16 h-screen smooth bg-base-300 md:w-24 md:hover:w-64"
  >
    <a class="text-center cursor-pointer" v-on:click="handleClickNav('/')">
      <Icon name="gi-ping-pong-bat" scale="2" />
    </a>

    <nav class="column full justify-between">
      <menu class="column gap-2">
        <li v-for="item in menuList">
          <button class="btn-nav" v-on:click="handleClickNav(item.url)">
            <Icon v-bind:name="item.icon" />
            <span class="hidden md:block whitespace-pre" v-text="item.text" />
          </button>
        </li>
      </menu>

      <menu class="column gap-2">
        <li>
          <button class="btn-nav" v-on:click="appStore.changeTheme()">
            <Icon v-bind:name="appStore.isDarkTheme" />
            <span
              class="hidden md:block whitespace-pre"
              v-text="'Change theme'"
            />
          </button>
        </li>

        <li>
          <button class="btn-nav" v-on:click="userStore.unsetMe()">
            <Icon v-bind:name="'md-logout'" />
            <span class="hidden md:block whitespace-pre" v-text="'Logout'" />
          </button>
        </li>
      </menu>
    </nav>
  </aside>
</template>
