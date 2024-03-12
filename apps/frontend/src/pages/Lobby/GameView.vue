<script setup lang="ts">
import { gameSocket } from "@/socket";
import type { iGame, iGameResult } from "@/types/props";

const appStore = useAppStore();
const meStore = useMeStore();

const { currentGame } = storeToRefs(meStore);
const status = ref<"idle" | "in-queue" | "in-game" | "post-game">("idle");
const gameResult = ref<string | null>(null);
const gameScore = ref<iGameResult["score"] | null>(null);
const map = ref<"classic" | "soccer" | "tennis-green" | "tennis-orange" | null>(null);

const handleClickFindGame = () => {
  gameSocket.emit("findGame");
};

const handleClickLeaveQueue = () => {
  gameSocket.emit("leaveQueue", () => {
    status.value = "idle";
  });
};

const reset = () => {
  map.value = null;
  status.value = "idle";
  gameResult.value = null;
  gameScore.value = null;
  meStore.changeStatusGame(null);
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
    meStore.changeStatusGame(match);
  });
  gameSocket.on("matchTerminated", ({ reason }: { reason: string }) => {
    appStore.changeMessageLog(`Warning! Match terminated: ${reason}`);
    setTimeout(() => {
      map.value = null;
      status.value = "idle";
      meStore.changeStatusGame(null);
    }, 2000);
  });
  gameSocket.on("endOfGame", ({ winnerId, score }: iGameResult) => {
    map.value = null;
    gameScore.value = score;
    status.value = "post-game";
    meStore.changeStatusGame(null);
    if (winnerId === meStore.data!.id) {
      gameResult.value = "Victory";
    } else {
      gameResult.value = "Defeat";
    }
  });
  if (!!currentGame.value) {
    status.value = "in-game";
  }
});

onUnmounted(() => {
  meStore.changeStatusGame(null);
  gameSocket.removeAllListeners();
  if (status.value === "in-queue") {
    gameSocket.emit("leaveQueue");
  }
});
watch(currentGame, (value) => {
  if (value) {
    status.value = "in-game";
  }
});
</script>

<template>
  <div class="size-full card-padding">
    <div class="md:border-card size-full column separate justify-center">
      <div class="center bg-base-300/60 size-full rounded">
        <div v-if="status !== 'in-game'" class="flex flex-col gap-4 items-center">
          <template v-if="status === 'post-game'">
            <h3 class="text-5xl font-bold" :class="gameResult === 'Victory' ? 'text-primary' : 'text-secondary'">
              {{ gameResult }}!
            </h3>
            <span class="font-bold text-3xl">{{ gameScore!.leftPlayer }} x {{ gameScore!.rightPlayer }}</span>
            <AButton class="btn-primary w-[10rem]" text="Play Again" @click="handleClickFindGame()" />
            <AButton class="btn-secondary btn-sm text-xs" text="Return to Lobby" @click="reset()" />
          </template>
          <template v-else>
            <button class="btn btn-primary" :disabled="status !== 'idle'" @click="handleClickFindGame()">
              <span v-if="status === 'in-queue'" class="loading loading-sm text-primary" />
              <template v-if="status === 'idle'">Find Game</template>
              <template v-else>Looking for an opponent</template>
            </button>
            <template v-if="status === 'in-queue'">
              <AButton class="btn-sm btn-secondary" text="Leave Queue" @click="handleClickLeaveQueue()" />
            </template>
          </template>
        </div>
        <MMapPicker v-else-if="!map" v-model="map" />
        <OGameCanvas v-else-if="!!currentGame && !!map" :map="map" :game="currentGame" />
      </div>
    </div>
  </div>
</template>
