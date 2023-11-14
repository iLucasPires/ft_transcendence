<script setup lang="ts">
import ListFriend from "@/components/ListFriend.vue";
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router";

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
  <main class="h-screen flex flex-row relative">
    <Navbar />
    <div class="p-10 w-full">
      <RouterView />
    </div>
    <ListFriend />
  </main>
</template>
