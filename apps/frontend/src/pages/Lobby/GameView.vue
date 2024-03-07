<script setup lang="ts">
import { gameSocket } from "@/socket";
import type { iGame } from "@/types/props";

const appStore = useAppStore();

const status = ref<"idle" | "in-queue" | "in-game">("idle");
const game = ref<iGame | null>(null);

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
  gameSocket.on("matchFound", (match: iGame) => {
    status.value = "in-game";
    game.value = match;
  });
});

onUnmounted(() => {
  gameSocket.removeAllListeners();
  if (status.value === "in-queue") {
    gameSocket.emit("leaveQueue");
  }
});
</script>

<template>
  <div class="full card-padding">
    <div class="md:border-card full column separate justify-center">
      <div class="center bg-base-300 size-full rounded">
        <!-- <div v-if="status !== 'in-game'" class="flex flex-col gap-4 items-center">
          <button class="btn btn-primary" :disabled="status !== 'idle'" @click="handleClickFindGame()">
            <span v-if="status === 'in-queue'" class="loading loading-sm text-primary" />
            <template v-if="status === 'idle'">Find Game</template>
            <template v-else>Looking for an opponent</template>
          </button>
          <template v-if="status === 'in-queue'">
            <AButton class="btn-sm btn-secondary" text="Leave Queue" @click="handleClickLeaveQueue()" />
          </template>
        </div>
        <OGameCanvas v-if="status === 'in-game' && !!game" :game="game" /> -->
        <OGameCanvas :game="{} as iGame" />
      </div>
    </div>
  </div>
</template>
