<script setup lang="ts">
import CardFriend from "./CardFriend.vue";
import { type iFriend } from "@/types/props";

defineProps({
  friends: {
    type: Array<iFriend>,
    required: true,
  },
});
</script>

<template>
  <aside class="flex flex-col gap-5 h-full w-72">
    <ul class="gap-5 border-2 border-neutral h-full p-5 rounded overflow-auto">
      <li v-for="friend in friends" :key="friend.id">
        <CardFriend :friend="friend" />
      </li>
    </ul>
  </aside>
</template>
