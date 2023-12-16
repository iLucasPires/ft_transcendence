<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { ref, computed, watch } from "vue";

const appStore = useAppStore();
const isVisible = ref(false);

const classType = computed(() => {
  if (appStore.logGlobal?.includes("Error")) return "alert-error";
  if (appStore.logGlobal?.includes("Success")) return "alert-success";
  if (appStore.logGlobal?.includes("Warning")) return "alert-warning";
  if (appStore.logGlobal?.includes("Info")) return "alert-info";

  return "alert-info";
});

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
    <p role="alert" :class="`alert ${classType}`">
      <Icon name="md-infooutline" />
      <span>{{ appStore.logGlobal }}</span>
    </p>
  </div>
</template>
