<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Ref } from "vue";

import api from "@/api";
import useStore from "@/store";
import Message from "@/components/Message.vue";

const store = useStore();
const message: Ref<string> = ref("");
const messageError: Ref<string> = ref("");

watch(message, (newMessage) => {
  const length = newMessage.length;

  messageError.value =
    length < 2
      ? "error: Nickname must be at least 2 characters"
      : length > 12
      ? "error: Nickname must be at most 12 characters"
      : message.value === store?.useData?.username
      ? "error: Nickname must be different from current"
      : "";
});

onMounted(() => {
  store.setMe();
});

async function handleSubmit() {
  if (messageError.value === "") {
    api.updateUsernameMe(store.useData.username, message.value);
  }
}
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <Message
      v-show="messageError"
      :type="messageError.substring(0, messageError.indexOf(':'))"
      :message="messageError.substring(messageError.indexOf(':') + 2)"
    />
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Almost there</h1>
        <p class="py-6">
          Please fill in your nickname and upload a profile picture
        </p>
      </div>

      <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form class="card-body" @submit.prevent="handleSubmit">
          <div class="container-center-row">
            <Picture size="lg" alt="Picture of the author" />
          </div>
          <div class="container-flex-col">
            <input
              type="text"
              placeholder="Nickname"
              v-model="message"
              class="input input-bordered input-primary w-full max-w-xs"
            />
          </div>
          <input
            type="file"
            class="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />

          <div class="form-control">
            <button
              class="btn btn-primary"
              :class="'btn-disabled' && messageError"
            >
              Finish
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
