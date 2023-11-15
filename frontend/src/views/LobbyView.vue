<script setup lang="ts">
import ListFriend from "@/components/friend/ListFriend.vue";
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";
import Achievement from "@/components/Achievement.vue";

const dataHistory = [
  {
    lobby: "Lobby 1",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
];
</script>

<template>
  <main class="h-screen w-full gap-5 relative flex">
    <Navbar />
    <RouterView />
    <ListFriend />
  </main>
</template>
