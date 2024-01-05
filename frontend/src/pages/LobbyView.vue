<script setup lang="ts">
import { RouterView } from "vue-router";

import AsideNavbar from "@/components/organisms/AsideNavbar.vue";
import ModalUpdateProfile from "@/components/organisms/ModalUpdateProfile.vue";

</script>

<template>

  <div class="h-full w-full relative hidden md:flex">
    <ModalUpdateProfile />
    <AsideNavbar />
    <RouterView />
  </div>

  
  <div class="flex h-full w-full relative md:hidden flex-col justify-center items-center">
    <h1 class="text-4xl font-bold text-primary mb-4">Pong</h1>
    <p class="text-2xl">Please use a bigger screen</p>
    <p class="text-2xl">width > 768px</p>
  </div>
</template>
