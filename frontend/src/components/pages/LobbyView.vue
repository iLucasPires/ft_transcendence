<script setup lang="ts">
import { RouterView } from "vue-router";

import AsideNavbar from "@/components/organisms/AsideNavbar.vue";
import ModalUpdateProfile from "@/components/organisms/ModalUpdateProfile.vue";
</script>

<template>
  <div class="flex h-full w-full relative">
    <ModalUpdateProfile />
    <AsideNavbar />
    <RouterView />
  </div>
</template>
