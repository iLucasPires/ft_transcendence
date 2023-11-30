<script setup lang="ts">
import { ref, type Ref } from "vue";

import { router } from "@/router";
import UseData from "@/store";
import ItemNavBar from "@/components/ItemNavBar.vue";

const store = UseData();
const menuOpen: Ref<boolean> = ref(true);
const modal: Ref<HTMLDialogElement | null> = ref(null);

function handleClickNav(url: string) {
  if (store.status.isGame) {
    modal.value?.showModal();
  } else {
    router.push(url);
  }
}

function handleClickLeaveGame() {
  store.status.isGame = false;
  store.gameData?.remove();
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
    <div class="flex items-center justify-between gap-2 w-full">
      <RouterLink to="/">
        <Typography
          class="text-2xl font-bold"
          :level="menuOpen ? 2 : 0"
          extraClass="text-primary"
        >
          {{ menuOpen ? "Pong" : "P" }}
        </Typography>
      </RouterLink>

      <Icon
        scale="1.5"
        name="md-keyboarddoublearrowleft"
        :class="{ 'transform -rotate-180': !menuOpen }"
        @click="menuOpen = !menuOpen"
      />
    </div>
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
        @click="store.changeTheme()"
        :menuOpen="menuOpen"
        :icon="store.isThemeDark ? 'md-lightmode' : 'md-nightlight'"
      >
        {{ store.isThemeDark ? "Light Mode" : "Dark Mode" }}
      </ItemNavBar>
      <ItemNavBar :menuOpen="menuOpen" icon="md-logout"> Logout </ItemNavBar>
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
