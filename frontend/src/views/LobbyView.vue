<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import useStore from "@/store";
import Navbar from "@/components/Navbar.vue";
import UpdateProfile from "@/components/UpdateProfile.vue";

const store = useStore();

onMounted(async function () {
  async function initLoobg() {
    await store.setMe();
    if (store.useData?.registrationComplete === false) {
      store.openModal();
    }
  }
  await initLoobg();
});
</script>

<template>
  <div class="flex h-full w-full relative">
    <UpdateProfile />
    <Navbar />
    <RouterView />
  </div>
</template>
