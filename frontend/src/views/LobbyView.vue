<script setup lang="ts">

import { RouterView } from "vue-router";

import ListFriend from "@/components/friend/ListFriend.vue";
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <main class="h-full w-full gap-5 relative flex">
    <Navbar />
    <RouterView />
    <ListFriend />
  </main>
</template>
