<script setup lang="ts">
import CardFriend from "./CardFriend.vue";

const friends = [
  {
    name: "Player 1",
    status: "online",
  },
  {
    name: "Player 2",
    status: "offline",
  },
  {
    name: "Player 3",
    status: "online",
  },
  {
    name: "Player 4",
    status: "offline",
  },
  {
    name: "Player 5",
    status: "online",
  },
];
</script>

<template>
  <aside class="hidden md:flex flex-col w-96 gap-5 h-full py-5">
    <ul class="gap-5 border-2 border-neutral h-full p-5 rounded overflow-auto">
      <li v-for="friend in friends" :key="friend.name">
        <CardFriend :friend="friend" />
      </li>
      <li v-for="friend in friends" :key="friend.name">
        <CardFriend :friend="friend" />
      </li>
      <li v-for="friend in friends" :key="friend.name">
        <CardFriend :friend="friend" />
      </li>
    </ul>
  </aside>
</template>

