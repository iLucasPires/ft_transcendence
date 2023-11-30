<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div v-if="loading" class="absolute inset-0 bg-base-100 z-30">
    <span class="relative text-primary inset-1/2 loading loading-spinner" />
  </div>
</template>
