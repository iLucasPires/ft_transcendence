<script setup lang="ts">
import { useMeStore } from "@/stores/meStore";
import { useAppStore } from "@/stores/appStore";

const meStore = useMeStore();
const appStore = useAppStore();

const menuList = [
  { url: "/profile", icon: "md-person", text: "Profile" },
  { url: "/users", icon: "md-supervisoraccount", text: "Users" },
  { url: "/game", icon: "io-game-controller", text: "Game" },
  { url: "/chat", icon: "io-chatbubbles-sharp", text: "Chat" },
];
</script>

<template>
  <aside
    class="separate column w-16 transition-all duration-300 bg-base-300 md:w-24 md:hover:w-64"
  >
    <a
      class="text-center cursor-pointer"
      v-on:click="
        meStore.status.isGame
          ? appStore.changeModalLeaveGame()
          : $router.push({ name: 'lobby' })
      "
    >
      <Icon name="gi-ping-pong-bat" scale="2" />
      <span
        class="hidden md:block whitespace-pre font-bold"
        v-text="'Pong 2'"
      />
    </a>

    <nav class="column full justify-between">
      <menu class="column gap-2">
        <li v-for="item in menuList">
          <button
            class="btn-nav"
            v-on:click="
              meStore.status.isGame
                ? appStore.changeModalLeaveGame()
                : $router.push(item.url)
            "
          >
            <Icon v-bind:name="item.icon" />
            <span class="hidden md:block whitespace-pre" v-text="item.text" />
          </button>
        </li>
      </menu>

      <menu class="column gap-2">
        <li>
          <button class="btn-nav" v-on:click="appStore.changeTheme()">
            <Icon v-bind:name="appStore.getIconByTheme" />
            <span
              class="hidden md:block whitespace-pre"
              v-text="'Change theme'"
            />
          </button>
        </li>

        <li>
          <button
            class="btn-nav"
            v-on:click="
              async () => {
                appStore.changeMessageLog(await meStore.unsetMe());
                $router.push({ name: 'login' });
              }
            "
          >
            <Icon v-bind:name="'md-logout'" />
            <span class="hidden md:block whitespace-pre" v-text="'Logout'" />
          </button>
        </li>
      </menu>
    </nav>
  </aside>
</template>
