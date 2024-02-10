<script setup lang="ts">
import { useMeStore } from "@/stores/meStore";
import { useAppStore } from "@/stores/appStore";

const meStore = useMeStore();
const appStore = useAppStore();

const menuList = [
  { url: "/profile", icon: "md-person", text: "Profile" },
  { url: "/users", icon: "md-supervisoraccount", text: "Users" },
  { url: "/game", icon: "md-videogameasset", text: "Game" },
  { url: "/chat", icon: "md-message", text: "Chat" },
];
</script>

<template>
  <aside class="separate column w-16 transition-all duration-300 bg-base-300 md:w-24 md:hover:w-64">
    <ALogo @click="meStore.status.isGame ? appStore.changeModalLeaveGame() : $router.push({ name: 'lobby' })" />

    <nav class="column full justify-between">
      <menu class="column gap-2">
        <li v-for="item in menuList">
          <AButton
            class="btn-nav"
            :icon="item.icon"
            :text="item.text"
            @click="meStore.status.isGame ? appStore.changeModalLeaveGame() : $router.push(item.url)"
          />
        </li>
      </menu>

      <menu class="column gap-2">
        <AButton
          class="btn-nav"
          :text="'Change theme'"
          :icon="appStore.getIconByTheme"
          @click="appStore.changeTheme()"
        />

        <AButton
          class="btn-nav"
          :text="'Logout'"
          :icon="'md-logout'"
          @click="
            meStore.unsetMe().then((log) => {
              appStore.changeMessageLog(log);
              $router.push({ name: 'login' });
            })
          "
        />
      </menu>
    </nav>
  </aside>
</template>
