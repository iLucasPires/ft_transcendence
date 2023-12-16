<script setup lang="ts">
import { RouterView } from "vue-router";

import Navbar from "@/components/Navbar.vue";
import UpdateProfile from "@/components/UpdateProfile.vue";
</script>

<template>
  <div class="flex h-full w-full relative">
    <UpdateProfile />
    <Navbar />
    <RouterView />
  </div>
</template>
