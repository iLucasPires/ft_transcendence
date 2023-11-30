<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  size: { type: String, default: "md" },
  url: { type: String, default: "https://picsum.photos/200" },
  alt: { type: String, required: true },
  maskType: { type: String, default: "circle" },
});

const size = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-10 h-10";
    case "md":
      return "w-20 h-20";
    case "lg":
      return "w-40 h-40";
    default:
      return "w-full h-full";
  }
});
</script>

<template>
  <div :class="`flex items-center w-20 h-20 `">
    <img
      :src="url"
      :alt="alt"
      :class="`object-scale-down mask mask-${maskType}`"
    />
  </div>
</template>
