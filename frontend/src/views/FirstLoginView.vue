<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import useStore from "@/store";
import { router } from "@/router";
import Message from "@/components/Message.vue";

const message = ref("");
const messageError = ref("");
const store = useStore();

watch(message, () => {
  if (message.value.length < 2) {
    messageError.value = "error: Nickname must be at least 2 characters";
  } else if (message.value.length > 12) {
    messageError.value = "error: Nickname must be at most 12 characters";
  } else if (message.value === store?.useData?.username) {
    messageError.value = "error: Nickname must be different from current";
  } else {
    messageError.value = "";
  }
});

onMounted(() => {
  store.getUseData();
});

async function handleSubmit() {
  if (messageError.value === "") {
    const response = await fetch(
      "http://localhost:3000/api/users/" + store.useData?.username,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: message.value }),
      }
    );
      console.log(response);

    if (response.status === 200) {
      await store.getUseData();
      router.push({ name: "lobby" });
    }
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
