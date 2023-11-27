<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import "./design/style.css";
import { initThemeData } from "./design/theme";

onMounted(() => initThemeData());
</script>

<template>
  <RouterView />
</template>
