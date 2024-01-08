<script setup lang="ts">
import { inject } from "vue";

const backendUrl = inject("backendUrl");

function handleLogin() {
  window.location.href = `${backendUrl}/api/auth/42`;
}
</script>

<template>
  <div class="hero min-h-screen bg-base-300">
    <div class="hero-content text-center">
      <div class="max-w-md column separate">
        <div>
          <h1 class="text-5xl font-bold" v-text="'Welcome to Transcendence'" />
          <p
            class="py-6"
            v-text="'enjoy the game with your friends and family'"
          />
        </div>
        <button v-on:click="handleLogin()" class="btn-full btn-primary">
          Connect with
          <Icon scale="1.5" name="si-42" />
        </button>
        <span
          class="text-xs text-gray-500"
          v-text="'powered by Lucas, Viny and Marcelo'"
        />
      </div>
    </div>
  </div>
</template>
