<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div class="size-full relative flex flex-row pl-16 md:pl-24">
    <ModalWelcome />
    <MModalAskGame />
    <AsideNavbar />
    <RouterView />
  </div>
</template>
