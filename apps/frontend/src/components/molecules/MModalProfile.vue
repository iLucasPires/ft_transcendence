<script setup lang="ts">
import type { iGame, iUser } from "@/types/props";
import { api } from "@/routes/apiRouter";

const props = defineProps<{ user: iUser }>();
defineEmits(["clickClose"]);

const appStore = useAppStore();
const games = ref<iGame[]>([]);
const wins = computed(() => games.value.reduce((acc, game) => acc + Number(game.result === "Victory"), 0));
const losses = computed(() => games.value.reduce((acc, game) => acc + Number(game.result === "Defeat"), 0));

onMounted(async () => {
  const res = await api.getUserGames(props.user.username);
  if (!res.ok) {
    appStore.changeMessageLog("Error: could not fetch match history");
  }
  games.value = await res.json();
});
</script>

<template>
  <dialog class="modal modal-open" @keydown.esc="$emit('clickClose')">
    <div class="modal-box relative flex flex-col items-center gap-4 p-4 max-w-[40rem] max-h-[40rem]">
      <AAvatar :username="user.username" :avatarUrl="user.avatarUrl" :isConnected="user.isConnected" />
      <h2 class="title">{{ user.username }}</h2>
      <ul class="wrap gap-2">
        <li class="btn btn-sm">
          Wins<span class="badge badge-primary">{{ wins }}</span>
        </li>
        <li class="btn btn-sm">
          Losses<span class="badge badge-primary">{{ losses }}</span>
        </li>
      </ul>
      <button @click="$emit('clickClose')" class="btn btn-sm absolute top-5 right-5">&times;</button>
      <div class="overflow-auto w-full">
        <OGamesHistory :username="user.username" :games="games" />
      </div>
    </div>
  </dialog>
</template>
