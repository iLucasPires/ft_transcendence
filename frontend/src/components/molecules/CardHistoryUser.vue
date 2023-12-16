<script setup lang="ts">
const dataHistory = [] as any[]

const isDataEmpty: boolean = dataHistory?.length !== 0;
</script>

<template>
  <div class="flex flex-col gap-5 mborder p-5">
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
      <p class="text-slate-200">No history yet</p>
    </div>
  </div>
</template>
