<script setup lang="ts">

function handleLogin() {
  window.location.href = "/api/auth/42";
}

</script>

<template>
  <div class="hero min-h-screen bg-base-300">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Welcome to Transcendence</h1>
        <p class="py-6">enjoy the game with your friends and family</p>
        <button 
        @click="handleLogin()"
        class="btn btn-neutral w-1/2 join-item font-semibold">
          Connect with
          <Icon scale="1.5" name="si-42" />
        </button>
      </div>
    </div>
  </div>
</template>
