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
      class="modal modal-open"
      v-if="!userStore.isComplete && $route.name !== 'edit-profile'"
    >
      <div class="modal-box column items-center">
        <h3 class="font-bold text-lg">Welcome to Transcendence</h3>
        <div class="py-4">
          <p>
            To unlock all game features, ensure you complete your profile by
            either editing it with your information or using the default values.
          </p>
        </div>
        <div class="w-full flex gap-1">
          <button
            class="btn-full btn-primary"
            v-on:click="handleEditProfile()"
            v-text="'Edit profile'"
          />
          <button
            class="btn-full btn-secondary"
            v-on:click="handleUseDefault()"
            v-text="'Use default'"
          />
        </div>
      </div>
    </dialog>

    <AsideNavbar />
    <RouterView />
  </div>
</template>
