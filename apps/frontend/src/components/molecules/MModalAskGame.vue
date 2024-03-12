<script setup lang="ts">
import router from "@/routes/vueRouter";
import { gameSocket } from "@/socket";
import type { iGame, iGameInvite } from "@/types/props";

const appStore = useAppStore();
const meStore = useMeStore();

const gameInvite = ref<iGameInvite | null>(null);
const showModal = computed(() => Boolean(gameInvite.value));

const onAcceptInvite = () => {
  gameSocket.emit("acceptInvite", gameInvite.value!.id);
};

const onRejectInvite = () => {
  gameSocket.emit("rejectInvite", gameInvite.value!.id);
  gameInvite.value = null;
};

onMounted(() => {
  gameSocket.on("gameInvite", (invite: iGameInvite) => {
    gameInvite.value = invite;
  });
  gameSocket.on("privateGameCreated", (game: iGame) => {
    gameInvite.value = null;
    meStore.changeStatusGame(game);
    router.push({ name: "game" });
  });
  gameSocket.on("inviteTimeout", (username?: string) => {
    // To
    if (!username) {
      gameInvite.value = null;
      appStore.changeMessageLog("Game invite timed out");
      return;
    }
    // From
    appStore.changeMessageLog(`The user ${username} didn't respond to your invite.`);
  });
  gameSocket.on("inviteRejected", (username: string) => {
    appStore.changeMessageLog(`The user ${username} rejected your invite.`);
  });
});
onUnmounted(() => {
  gameSocket.removeListener("gameInvite");
  gameSocket.removeListener("privateGameCreated");
  gameSocket.removeListener("inviteTimeout");
  gameSocket.removeListener("inviteRejected");
});
</script>

<template>
  <dialog id="modalLeaveGame" class="modal modal-open" v-if="showModal">
    <div class="modal-box">
      <div class="flex flex-col items-center gap-2 mb-2">
        <h3 class="title text-primary">Game Invite</h3>
        <img :src="gameInvite!.from.avatarUrl" alt="avatar user" class="size-20 rounded-full" />
        <h2 class="font-bold">{{ gameInvite!.from.username }}</h2>
      </div>
      <div class="flex w-full gap-2">
        <button class="btn-full btn-sm btn-primary" v-on:click="onAcceptInvite()">Accept</button>
        <button class="btn-full btn-sm btn-secondary" v-on:click="onRejectInvite()">Reject</button>
      </div>
    </div>
  </dialog>
</template>
