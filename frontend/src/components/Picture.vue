<script setup lang="ts">
defineProps({
  url: { type: String, required: false },
  alt: { type: String, required: true },
});
</script>

<template>
  <div :class="`flex items-center w-20 h-20 `">
    <img
      :alt="alt"
      :src="url || `https://robohash.org/${alt}.png`"
      :class="`object-scale-down mask mask-circle`"
    />
  </div>
</template>
