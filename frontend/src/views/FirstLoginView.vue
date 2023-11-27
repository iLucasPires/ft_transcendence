<script setup lang="ts">
import { ref } from "vue";

const message = ref("");
const messageError = ref("");

function handleSubmit() {
  if (message.value.length < 2) {
    messageError.value = "Nickname must be at least 1 characters";
  } else if (message.value.length > 12) {
    messageError.value = "Nickname must be less than 12 characters";
  } else {
    messageError.value = "";
  }
}
</script>

<template>
  <div class="hero min-h-screen bg-base-200 ">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Almost there</h1>
        <p class="py-6">
          Please fill in your nickname and upload a profile picture
        </p>
      </div>

      <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body " @submit.prevent="handleSubmit">
          <div class="container-center-row">
            <Picture size="lg" alt="Picture of the author" />
          </div>
          <div class="container-flex-col">
            <input
              type="text"
              placeholder="Nickname"
              v-model="message"
              className="input input-bordered input-primary w-full max-w-xs"
            />
            <span className="text-xs text-gray-500 my-1" v-if="messageError">
              {{ messageError }}
            </span>
          </div>

          <input
            type="file"
            className="file-input file-input-bordered file-input-primary w-full max-w-xs"
          />

          <div className="form-control ">
            <button className="btn btn-primary">Finish</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
