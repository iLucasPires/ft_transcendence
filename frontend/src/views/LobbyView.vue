<script setup lang="ts">
import { RouterView } from "vue-router";

import ListFriend from "@/components/friend/ListFriend.vue";
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <div class="flex h-full w-full">
    <Navbar />
    <RouterView />
  </div>
</template>
