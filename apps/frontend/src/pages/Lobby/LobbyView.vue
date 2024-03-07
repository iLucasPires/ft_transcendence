<script setup lang="ts">
import { RouterView } from "vue-router";

import AsideNavbar from "@/components/AsideNavbar.vue";
import ModalWelcome from "@/components/ModalWelcome.vue";
</script>

<template>
  <div class="size-full relative flex flex-row md:pl-24">
    <ModalWelcome />
    <AsideNavbar />
    <RouterView />
  </div>
</template>
