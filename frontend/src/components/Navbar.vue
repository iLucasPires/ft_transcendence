<script setup lang="ts">
import { ref, type Ref } from "vue";

import { router } from "@/routes/vueRouter";
import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";
import ItemNavBar from "@/components/ItemNavBar.vue";

const userStore = useUserStore();
const appStore = useAppStore();
const menuOpen: Ref<boolean> = ref(true);
const modal: Ref<HTMLDialogElement | null> = ref(null);

function handleClickNav(url: string) {
  if (userStore.status.isGame) {
    modal.value?.showModal();
  } else {
    router.push(url);
  }
}

function handleClickLeaveGame() {
  userStore.status.isGame = false;
  appStore.gameP5?.remove();
  modal.value?.close();
}

function handleClickBackToGame() {
  modal.value?.close();
}

const menuList = [
  { url: "/game", icon: "io-game-controller", text: "Game" },
  { url: "/users", icon: "md-person", text: "Users" },
  {
    url: "/chat",
    icon: "io-chatbubbles-sharp",
    text: "Chat",
  },
  {
    url: "/history",
    icon: "md-workhistory-round",
    text: "History",
  },
];
</script>

<template>
  <aside
    :class="{ 'w-64': menuOpen, 'w-24': !menuOpen }"
    class="p-5 flex flex-col bg-base-300 transition-all duration-300"
  >
    <RouterLink to="/">
      <Typography
        class="text-2xl font-bold"
        extraClass="text-primary text-center"
      >
        Pong
      </Typography>
    </RouterLink>

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
        @click="menuOpen = !menuOpen"
        :invertIcon="!menuOpen"
        icon="md-keyboarddoublearrowleft"
      >
        Resize Menu
      </ItemNavBar>

      <ItemNavBar
        @click="appStore.changeGlobalTheme()"
        :menuOpen="menuOpen"
        :icon="appStore.isDarkTheme ? 'md-sunny' : 'md-moon'"
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

  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Warning</h3>
      <p class="py-4">
        You are currently in a game, if you leave you will lose the game.
      </p>
      <div class="modal-action">
        <form method="dialog">
          <div class="join">
            <button class="btn join-item" @click="handleClickBackToGame">
              Back to game
            </button>
            <button
              class="btn join-item btn-primary"
              @click="handleClickLeaveGame"
            >
              get out
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
