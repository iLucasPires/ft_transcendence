<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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
  <aside class="hiddenx md:bg-amber-500 flex-col gap-5 h-full  bg-red-600 w-72 py-5">
    <ul class="gap-5 border-2 border-neutral h-full p-5 rounded overflow-auto">
      <li v-for="friend in friends" :key="friend.id">
        <CardFriend :friend="friend" />
      </li>
    </ul>
  </aside>
</template>
