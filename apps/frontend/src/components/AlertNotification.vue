<script setup lang="ts">
const appStore = useAppStore();
</script>

<template>
  <div v-if="appStore.log.length > 0">
    <ul class="column absolute bottom-4 right-4 z-50 gap-2">
      <li
        role="alert"
        class="alert shadow-lg border"
        v-bind:class="{
          'border-success': item.includes('Success'),
          'border-warning': item.includes('Warning'),
          'border-error': item.includes('Failed'),
        }"
        v-for="item in appStore.log"
      >
        <Icon name="md-crisisalert" />
        <span v-text="item" />
      </li>
    </ul>
  </div>
</template>
