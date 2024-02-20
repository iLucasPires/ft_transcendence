<script setup lang="ts">
defineProps<{
  name: string;
  value: number;
}>();
</script>

<template>
  <div class="btn btn-sm">
    <span>{{ name }}</span>
    <span class="badge badge-primary">{{ value }}</span>
  </div>
</template>
