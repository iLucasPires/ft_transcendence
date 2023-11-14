<script setup lang="ts">
import type { PropType } from "vue";
import type { iHistory } from "@/types/history";

const props = defineProps({
  data: {
    type: Object as PropType<iHistory[]>,
    required: false,
  },
});

const isDataEmpty: boolean = props.data?.length !== 0;
</script>

<template>
  <div v-if="isDataEmpty" class="border-2 border-neutral p-5 rounded h-full">
    <h1 class="text-2xl font-bold mb-5">History</h1>
    <div class="">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Lobby</th>
            <th>Players</th>
            <th>Scoreboard</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data">
            <td>{{ item.lobby }}</td>
            <td>{{ item.players }}</td>
            <td>{{ item.scoreboard }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
