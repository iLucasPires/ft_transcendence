<script setup lang="ts">
defineProps({
  type: { type: String, default: "li" },
  icon: { type: String, required: true },
  invertIcon: { type: Boolean, default: false },
  isMenuOpen: { type: Boolean, default: true },
});
</script>

<template>
  <component :is="type" class="btn focus:btn-primary hover:btn-primary w-full flex-nowrap justify-start gap-6 overflow-hidden">
    <Icon scale="1" :name="icon" :class="{'transform -rotate-180': invertIcon}" />
    <Typography v-if="isMenuOpen" class="uppercase" :level="2">
      <slot></slot>
    </Typography>
  </component>
</template>
