<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";

const appStore = useAppStore();
</script>

<template>
  <div class="absolute inset-0 z-30 bg-base-100" v-if="appStore.loddingGlobal">
    <span class="loading loading-spinner text-primary"></span>
  </div>
</template>
