<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  level: { type: Number, default: 0 },
  italic: { type: Boolean, default: false },
  weight: { type: String, default: "normal" },
  size: { type: String, default: "md" },
  color: { type: String, default: "neutral" },
  align: { type: String, default: "left" },
  transform: { type: String, default: "none" },
  type: { type: String, default: "normal" },
});

const headings = computed(() => {
  if (props.level == 0) return "p";
  else return "h" + props.level;
});
</script>

<template>
  <component
    :is="headings"
    :class="`text-${color} text-${size} font-${weight} text-${align} text-${transform} font-${type}`"
  >
    <slot></slot>
  </component>
</template>
