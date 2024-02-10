<script setup lang="ts">
defineProps<{ text: string; icon?: string }>();
</script>

<template>
  <button class="btn">
    <Icon v-if="icon !== undefined" :name="icon" />
    <span class="hidden md:block whitespace-pre">{{ text }}</span>
  </button>
</template>
