<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps({
  type: { type: String, default: "li" },
  isMenuOpen: { type: Boolean, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
});
</script>

<template>
  <component :is="type">
    <RouterLink
      :to="url"
      class="btn focus:btn-primary hover:btn-primary w-full flex-nowrap justify-start"
    >
      <Icon scale="1" :name="icon" />
      <Typography v-if="isMenuOpen" class="uppercase" :level="2">
        <slot></slot>
      </Typography>
    </RouterLink>
  </component>
</template>
