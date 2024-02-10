<script setup lang="ts">
function handleLogin() {
  window.location.href = "/api/auth/42";
}
</script>

<template>
  <div class="hero min-h-screen bg-base-300">
    <div class="hero-content text-center">
      <div class="max-w-md column separate">
        <div>
          <h1 class="text-5xl font-bold" v-text="'Welcome to Transcendence'" />
          <p class="py-6" v-text="'enjoy the game with your friends and family'" />
        </div>
        <AButton 
          @click="handleLogin()" 
          class="btn-primary" 
          text="Connect with" 
          icon="si-42" 
        />
      </div>
    </div>
  </div>
</template>
