<script setup lang="ts">
import { ref, type Ref } from "vue";

import { router } from "@/router";
import UseData from "@/store";
import ItemNavBar from "@/components/ItemNavBar.vue";

const store = UseData();
const menuOpen: Ref<boolean> = ref(true);
const modal: Ref<HTMLDialogElement | null> = ref(null);

function handleclick(url: string) {
  if (store.status.isGame) {
    modal.value?.showModal();
  } else {
    router.push(url);
  }
}
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Warning</h3>
      <p class="py-4">
        You are currently in a game, if you leave you will lose the game.
      </p>
      <div class="modal-action">
        <form method="dialog">
          <div class="join">
            <button @click="() => modal?.close()" class="btn join-item">
              Back to game
            </button>
            <button
              class="btn join-item btn-primary"
              @click="
                () => {
                  store.status.isGame = false;
                  store.gameData?.remove();
                  modal?.close();
                }
              "
            >
              get out
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
  <aside
    :class="{ 'w-64': menuOpen, 'w-24': !menuOpen }"
    class="p-5 flex flex-col bg-base-300 transition-all duration-300"
  >
    <div class="container-center-row gap-2 w-full">
      <Icon
        scale="1.5"
        name="md-keyboarddoublearrowleft"
        :class="{ 'transform -rotate-180': !menuOpen }"
        @click="() => (menuOpen = !menuOpen)"
      />
    </div>
    <nav class="flex flex-col flex-1 justify-between mt-10">
      <ul>
        <ItemNavBar
          v-for="item in [
            { url: '/profile', icon: 'md-person', text: 'Profile' },
            { url: '/game', icon: 'io-game-controller', text: 'Game' },
            {
              url: '/chat',
              icon: 'io-chatbubbles-sharp',
              text: 'Chat',
            },
            {
              url: '/history',
              icon: 'md-workhistory-round',
              text: 'History',
            },
          ]"
          @click="() => handleclick(item.url)"
          :to="item.url"
          :key="item.url"
          :menuOpen="menuOpen"
          :icon="item.icon"
        >
          {{ item.text }}
        </ItemNavBar>
      </ul>
    </nav>
    <button class="w-full dropdown dropdown-right dropdown-end">
      <ItemNavBar type="span" :menuOpen="menuOpen" icon="md-settings">
        Settings
      </ItemNavBar>
      <ul
        class="dropdown-content w-52 z-10 mx-2 border-2 border-primary menu p-2 bg-base-100 rounded-box gap-2"
      >
        <ItemNavBar
          type="span"
          @click="() => store.changeTheme()"
          :icon="store.isThemeDark ? 'md-lightmode' : 'md-nightlight'"
        >
          {{ store.isThemeDark ? "Light Mode" : "Dark Mode" }}
        </ItemNavBar>
        <ItemNavBar
          @click="() => $router.push('/')"
          type="span"
          icon="md-logout"
        >
          Logout
        </ItemNavBar>
      </ul>
    </button>
  </aside>
</template>
