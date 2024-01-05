<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { ref, watch } from "vue";

const appStore = useAppStore();
const isVisible = ref(false);


watch(
  () => appStore.logGlobal,
  () => {
    if (appStore.logGlobal != "") {
      isVisible.value = true;
      setTimeout(() => {
        isVisible.value = false;
        appStore.logGlobal = "";
      }, 2000);
    }
  }
);
</script>

<template>
  <div v-if="isVisible" class="absolute z-50 bottom-5 right-4">
    <p role="alert" :class="`alert alert-info`">
      <Icon name="md-info-round" />
      <span>{{ appStore.logGlobal }}</span>
    </p>
  </div>
</template>
