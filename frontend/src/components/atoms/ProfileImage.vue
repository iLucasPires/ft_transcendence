<script setup lang="ts">
import { computed, inject } from "vue";

const props = defineProps({
  url: { type: String, required: false },
  alt: { type: String, required: true },
  isInternal: { type: Boolean, required: false },
});

const urlImage = computed(() => {
  if (props.isInternal && props.url) return props.url;
  if (!props.isInternal && props.url) return inject("backendUrl") + props.url;
  return `https://robohash.org/${props.alt}.png`;
});
</script>

<template>
  <div class="flex items-center w-20 h-20 mask mask-circle ">
    <img
      :alt="alt"
      :src="urlImage"
      class="h-full bg-base-300 object-cover"
    />
  </div>
</template>
