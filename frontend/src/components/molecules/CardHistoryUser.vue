<script setup lang="ts">
const dataHistory = [
  {
    lobby: "Lobby 1",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 4",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 5",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 6",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 7",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 8",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 9",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 10",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 4",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 5",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 6",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 7",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 8",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 9",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 10",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 4",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 5",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 6",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 7",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 8",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 9",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 10",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 4",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 5",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 6",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 7",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 8",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 9",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 10",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 4",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 5",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 6",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 7",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 8",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 9",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 10",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 2",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 3",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 4",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 5",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 6",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 7",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 8",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 9",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
  {
    lobby: "Lobby 10",
    players: "Player 1, Player 2",
    scoreboard: "10 - 5",
  },
];

const isDataEmpty: boolean = dataHistory?.length !== 0;
</script>

<template>
  <div class="flex flex-col gap-5">
    <h2 class="text-2xl font-bold">History</h2>
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
      <p class="text-current">No history yet</p>
    </div>
  </div>
</template>
