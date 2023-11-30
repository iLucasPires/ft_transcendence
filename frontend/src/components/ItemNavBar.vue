<script setup lang="ts">

defineProps({
  type: { type: String, default: "li" },
  icon: { type: String, required: true },
  isMenuOpen: { type: Boolean, default: true },
});
</script>

<template>
  <component :is="type" class="btn-item-nav-bar">
    <Icon scale="1" :name="icon" />
    <Typography v-if="isMenuOpen" class="uppercase" :level="2">
      <slot></slot>
    </Typography>
  </component>
</template>

<style scoped>
.btn-item-nav-bar {
  @apply btn my-1;
  @apply flex-nowrap justify-start;
  @apply focus:btn-primary hover:btn-primary w-full;
}
</style>
