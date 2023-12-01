<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import useStore from "@/store";
import Navbar from "@/components/Navbar.vue";

const store = useStore();

onMounted(() => {
  store.setMe();
});
</script>

<template>
  <div class="flex h-full w-full relative">
    <Navbar />
    <RouterView />
  </div>
</template>
