<script setup lang="ts">
const appStore = useAppStore();
const emits = defineEmits(["clickTab"]);
</script>

<template>
  <div class="flex gap-1" data-tabs="tabs" role="tablist">
    <button
      v-for="tab in ['all', 'friends', 'blocked']"
      @click="
        appStore.changeTab(tab);
        $emit('clickTab', tab);
      "
      :aria-selected="appStore.tab === tab"
      class="btn btn-sm aria-selected:btn-primary"
    >
      {{ tab }}
    </button>
  </div>
</template>
