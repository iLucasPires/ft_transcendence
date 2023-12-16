<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";

defineProps({
  type: { type: String, default: "li" },
  icon: { type: String, required: true },
  invertIcon: { type: Boolean, default: false },
});

const appStore = useAppStore();
</script>

<template>
  <component
    :is="type"
    class="btn focus:btn-primary hover:btn-primary w-full flex-nowrap justify-start gap-6 overflow-hidden"
  >
    <Icon scale="1" :name="icon" />
    <h2 v-if="appStore.navBarExpand" class="uppercase whitespace-pre">
      <slot />
    </h2>
  </component>
</template>
