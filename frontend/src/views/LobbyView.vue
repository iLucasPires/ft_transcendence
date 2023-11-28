<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import { onMounted } from "vue";
import useStore from "@/store";

const store = useStore();

onMounted(() => {
  if (!store.useData) store.getUseData();
});

</script>

<template>
  <div class="flex h-full w-full relative">
    <Navbar />
    <RouterView />
  </div>
</template>
