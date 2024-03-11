<script setup lang="ts">
import type { iGame } from "@/types/props";

const props = defineProps<{ username: string; games: iGame[] }>();

const getOpponentUsername = (game: iGame) => {
  if (game.leftPlayer.username === props.username) {
    return game.rightPlayer.username;
  }
  if (game.rightPlayer.username === props.username) {
    return game.leftPlayer.username;
  }
};

const getOpponentAvatar = (game: iGame) => {
  if (game.leftPlayer.username === props.username) {
    return game.rightPlayer.avatarUrl ?? `https://robohash.org/${game.rightPlayer.username}.png`;
  }
  if (game.rightPlayer.username === props.username) {
    return game.leftPlayer.avatarUrl ?? `https://robohash.org/${game.leftPlayer.username}.png`;
  }
};
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Opponent</th>
        <th>Score</th>
        <th>Result</th>
        <th>Played At</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(game, idx) in games">
        <th>{{ idx + 1 }}</th>
        <td class="flex items-center gap-2">
          <img
            class="w-8 rounded-full bg-base-200"
            :src="getOpponentAvatar(game)"
            :alt="`avatar of ${getOpponentUsername(game)}`"
          />
          {{ getOpponentUsername(game) }}
        </td>
        <td>{{ `${game.score.leftPlayer} X ${game.score.rightPlayer}` }}</td>
        <td>
          <span
            class="font-bold"
            :class="
              game.result === 'Victory'
                ? 'text-success'
                : game.result === 'Defeat'
                  ? 'text-error'
                  : 'text-base-content/60'
            "
          >
            {{ game.result }}
          </span>
        </td>
        <td>{{ new Date(game.createdAt).toLocaleString("pt-BR") }}</td>
      </tr>
    </tbody>
  </table>
</template>
