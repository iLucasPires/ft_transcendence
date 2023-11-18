<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import CardFriend from "./CardFriend.vue";

</script>

<template>
  <aside class="hidden md:flex flex-col w-96 gap-5 h-full py-5">
    <ul class="gap-5 border-2 border-neutral h-full p-5 rounded overflow-auto">
      <li v-for="friend in friends" :key="friend.id">
        <CardFriend :friend="friend" />
      </li>
    </ul>
  </aside>
</template>
