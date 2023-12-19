<script setup lang="ts">
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/userStore";

const message = ref("");
const listMessages = ref([] as string[]);
const userStore = useUserStore();
const socket = io("http://localhost:3000/chat", {
  transports: ["websocket"],
  extraHeaders: {
    Credentials: "include",
  },
});

onMounted(() => {
  socket.on("message", (message: string) => {
    listMessages.value.push(message);
    console.log(message);
  });
});

function handleSubmit() {
  socket.emit("message", userStore.meData.username);
  message.value = "";
}
</script>

<template>
  <div class="w-full h-full p-10">
    <div
      class="mborder h-full w-full p-5 mflex-col justify-center items-center gap-5"
    >
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 w-96">
        <h1 class="text-2xl font-bold mb-5">Chat</h1>
        <input class="input input-bordered" v-model="message" type="text" />
        <button class="btn btn-primary">Enviar</button>
      </form>
      <div class="flex flex-col gap-4 w-96 h-96 bg-base-300 p-4 rounded">
        <h1 class="text-2xl font-bold">Mensagens</h1>
        <ul class="flex flex-col overflow-y-auto flex-1">
          <li v-for="msg in listMessages">
            {{ msg }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
