<script setup lang="ts">
import { RouterView } from "vue-router";

import AsideNavbar from "@/components/AsideNavbar.vue";

</script>

<template>
  <div class="full relative flex flex-row  ">
    <AsideNavbar />
    <RouterView />
  </div>
</template>
