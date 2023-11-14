<script setup lang="ts">
import History from "@/components/History.vue";
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
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
  {
    lobby: "Lobby 3",
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
  <div class="flex flex-col gap-5 justify-between h-full">
    <div class="flex items-center gap-5">
      <img
        class="mask mask-circle w-40 h-40"
        src="https://via.placeholder.com/250"
        alt="profile"
      />
      <div class="flex flex-col gap-5">
        <div>
          <h1 class="text-3xl font-bold text-slate-200">Marcelo lindão</h1>
          <p sclass="text-slate-199 italic">level 1</p>
        </div>
        <div class="flex gap-5">
          <div class="tooltip flex gap-2" data-tip="Vitórias">
            <v-icon name="ri-ping-pong-fill" class="text-3xl text-green-400" />
            <p class="text-slate-200">232</p>
          </div>
          <div class="tooltip flex gap-2" data-tip="Derrotas">
            <v-icon name="ri-ping-pong-fill" class="text-3xl text-red-400" />
            <p class="text-slate-200">232</p>
          </div>
        </div>
      </div>
    </div>
    <History class="h-3/5" :data="dataHistory" />
  </div>
</template>
