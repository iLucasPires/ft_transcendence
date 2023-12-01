<script setup lang="ts">
import "./design/style.css";

import { onMounted } from "vue";
import { RouterView } from "vue-router";

import useStore from "@/store";

const store = useStore();

onMounted(() => {
  store.setTheme();
});
</script>

<template>
  <RouterView />
</template>
