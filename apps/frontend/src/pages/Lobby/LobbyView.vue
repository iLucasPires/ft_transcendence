<script setup lang="ts">
import { RouterView } from "vue-router";

import AsideNavbar from "@/components/AsideNavbar.vue";
import ModalWelcome from "@/components/ModalWelcome.vue";
</script>

<template>
  <div class="full relative flex flex-row">
    <ModalWelcome />
    <AsideNavbar />
    <RouterView />
  </div>
</template>
