<script setup lang="ts">
import ListFriend from "@/components/friend/ListFriend.vue";
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <main class="h-screen w-full gap-5 relative flex">
    <Navbar />
    <RouterView />
    <ListFriend />
  </main>
</template>
