<script setup lang="ts">
import { api } from "@/routes/apiRouter";
import type { iGame } from "@/types/props";

const appStore = useAppStore();
const meStore = useMeStore();

const infos = computed(() => {
  return [
    { name: "Wins", value: 10 },
    { name: "Losses", value: 10 },
    { name: "Status", value: "Online" },
    { name: "2FA", value: meStore.is2FA ? "Enabled" : "Disabled" },
  ];
});
const games = ref<iGame[]>([]);

onMounted(async () => {
  const res = await api.getUserGames(meStore.data?.username ?? "");
  if (!res.ok) {
    appStore.changeMessageLog("Error: could not fetch match history");
  }
  games.value = await res.json();
});
</script>

<template>
  <main class="size-full card-padding">
    <div class="size-full column separate md:border-card">
      <div class="column separate rounded relative border-card">
        <button
          class="btn btn-primary btn-sm absolute top-4 right-4"
          v-on:click="$router.push({ name: 'edit-profile' })"
        >
          <span class="hidden md:inline-block">Edit profile</span>
          <Icon name="md-modeedit" />
        </button>
        <div class="flex items-end gap-4">
          <div className="avatar">
            <div className="w-24 rounded-full bg-base-300">
              <img
                v-bind:src="meStore.data?.avatarUrl || `https://robohash.org/${meStore.data?.username}.png`"
                v-bind:alt="'profile picture'"
              />
            </div>
          </div>

          <h2 class="text-3xl font-bold" v-text="meStore.data?.username" />
        </div>
        <ul class="wrap gap-2">
          <button v-for="item in infos" v-bind:key="item.name" className="btn btn-sm">
            <span v-text="item.name" />
            <div className="badge badge-primary" v-text="item.value" />
          </button>
        </ul>
      </div>

      <div class="border-card overflow-x-auto h-full">
        <OGamesHistory :games="games" />
      </div>
    </div>
  </main>
</template>
