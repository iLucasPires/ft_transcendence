<script setup lang="ts">
import { gameSocket } from "@/socket";
import type { iGame } from "@/types/props";

const appStore = useAppStore();

const status = ref<"idle" | "in-queue" | "in-game">("idle");

const handleClickFindGame = () => {
  gameSocket.emit("findGame");
};

const handleClickLeaveQueue = () => {
  gameSocket.emit("leaveQueue", () => {
    status.value = "idle";
  });
};

onMounted(() => {
  gameSocket.on("waitingInQueue", () => {
    status.value = "in-queue";
  });
  gameSocket.on("matchmakingTimeout", () => {
    status.value = "idle";
    appStore.changeMessageLog("Warning: couldn't find an opponent, you were removed from the queue.");
  });
  gameSocket.on("gameFound", (game: iGame) => {
    status.value = "in-game";
    console.log(`Game found: ${game.id}`);
  });
});
</script>

<template>
  <div class="full card-padding">
    <div class="md:border-card full column separate justify-center">
      <div class="center bg-base-300 w-full h-[94%] rounded">
        <template v-if="status === 'idle'">
          <AButton class="btn-primary" text="Find Game" @click="handleClickFindGame()" />
        </template>
        <template v-else-if="status === 'in-queue'">
          <div class="flex flex-col gap-4 items-center">
            <h2 class="text-primary">Looking for an opponent...</h2>
            <AButton class="btn-sm w-[5rem]" text="Leave" @click="handleClickLeaveQueue()" />
          </div>
        </template>
        <template v-else-if="status === 'in-game'">
          <h2 class="text-primary text-center">Not implemented</h2>
        </template>
      </div>
    </div>
  </div>
</template>
