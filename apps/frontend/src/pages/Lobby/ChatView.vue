<script setup lang="ts">
import { ref } from "vue";

type UserChat = {
  name: string;
  photo: string;
};

type Message = {
  id: number;
  message: string;
  user: UserChat;
};

const fakeUserChat = [
  {
    name: "John Doe",
    photo: "https://i.pravatar.cc/150",
  },
  {
    name: "Jane Doe",
    photo: "https://i.pravatar.cc/150",
  },
  {
    name: "John Smith",
    photo: "https://i.pravatar.cc/150",
  },
  {
    name: "Jane Smith",
    photo: "https://i.pravatar.cc/150",
  },
] as UserChat[];

const userSelect = ref<UserChat | null>(null);
const message = ref("");
const messages = ref([] as Message[]);

const handleSendMessage = () => {
  if (!message.value) return;
  if (!userSelect.value) return;

  messages.value.push({
    id: Date.now(),
    message: message.value,
    user: userSelect.value,
  });
  message.value = "";
};

const handleGetMessages = (user: UserChat) => {
  userSelect.value = user;
  messages.value = [];
};

</script>

<template>
  <main class="full card-padding overflow-hidden">
    <div class="row h-full separate">
      <div class="w-96 border-card p-4">
        <input type="text" class="input input-bordered w-full" placeholder="Search" />
        <ul class="overflow-y-auto h-full flex flex-col gap-2 mt-4">
          <li
            class="flex items-center separate cursor-pointer border-card"
            v-for="user in fakeUserChat"
            v-bind:class="userSelect?.name === user.name && 'border-primary'"
            v-on:click="handleGetMessages(user)"
            v-bind:key="user.name"
          >
            <div class="avatar">
              <div class="w-16 rounded-full bg-base-200">
                <img v-bind:src="user.photo" v-bind:alt="`avatar of ${user.name}`" />
              </div>
            </div>
            <h2 class="title" v-text="user.name" />
          </li>
        </ul>
      </div>

      <div class="w-full border-card separate flex flex-col h-full">
        <div class="h-full flex flex-col gap-2">
          <div v-if="messages.length !== 0" class="overflow-y-auto h-full flex flex-col-reverse py-2">
            <ul class="flex flex-col gap-2">
              <li class="border-card p-4" v-for="message in messages" v-bind:key="message.id">
                <div class="flex items-center gap-2">
                  <div class="avatar">
                    <div class="w-16 rounded-full bg-base-200">
                      <img v-bind:src="message.user.photo" v-bind:alt="`avatar of ${message.user.name}`" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-md" v-text="message.user.name" />
                    <p class="text-md font-bold" v-text="message.message" />
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="flex items-center justify-center h-full">
            <p class="text-2xl font-bold">No messages</p>
          </div>

          <form class="flex items-center" v-on:submit.prevent="handleSendMessage">
            <textarea
              type="text"
              name="message"
              class="textarea bg-base-300 w-full h-5 resize-y"
              placeholder="Type a message"
              v-model="message"
            />
            <button class="btn btn-primary ml-2 h-5">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
