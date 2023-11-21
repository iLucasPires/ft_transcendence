<script setup lang="ts">
import { type PropType } from "vue";
import { type iHistory } from "@/types/props.js";
import Typography from "../Typography.vue";

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
    lobby: "Lobby 2",
    players: "Player 1, Player 2, Player 3",
    scoreboard: "Player 1: 100, Player 2: 200, Player 3: 300",
  },
];

const isDataEmpty: boolean = dataHistory?.length !== 0;
</script>

<template>
  <div
    class="h-full w-full flex flex-col border-2 border-neutral p-5 rounded overflow-auto"
  >
    <Typography :level="2" weight="semibold" size="xl"> History </Typography>
    <div v-if="isDataEmpty" class="h-full w-full overflow-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Lobby</th>
            <th>Players</th>
            <th>Scoreboard</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataHistory">
            <td>{{ item.lobby }}</td>
            <td>{{ item.players }}</td>
            <td>{{ item.scoreboard }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full">
      <p class="text-slate-200">No history yet</p>
    </div>
  </div>
</template>
