<script setup lang="ts">
import { RouterView } from "vue-router";
import AsideNavbar from "@/components/AsideNavbar.vue";
import { useUserStore } from "@/stores/userStore";
import { router } from "@/routes/vueRouter";

const userStore = useUserStore();

function handleEditProfile() {
  router.push({ name: "edit-profile" });
}

async function handleUseDefault() {
  await userStore.changeCompleteRegistration();
}
</script>

<template>
  <div class="full relative flex flex-row">
    <dialog
      class="modal"
      v-bind:class="{ 'modal-open': !userStore.isComplete }"
    >
      <div class="modal-box column items-center">
        <h3 class="font-bold text-lg">Welcome to Transcendence</h3>
        <div class="py-4">
          <p>you need to complete your profile to play the game</p>
          <p>but you can use default for now and edit it later</p>
        </div>

        <div class="w-full flex gap-1">
          <button class="btn-full btn-primary" v-on:click="handleEditProfile()">
            Go to now
          </button>
          <button
            class="btn-full btn-secondary"
            v-on:click="handleUseDefault()"
          >
            Use default
          </button>
        </div>
      </div>
    </dialog>

    <AsideNavbar />
    <RouterView />
  </div>
</template>
