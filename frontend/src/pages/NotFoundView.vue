<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold mb-5">404</h1>
        <img
          src="https://media.giphy.com/media/HL4zwTG6PV9hm/giphy.gif"
          alt="404"
        />
        <p class="py-6">Page not found. Check the address or 
            <RouterLink to="/" class="text-primary">go back</RouterLink>
        </p>
        
      </div>
    </div>
  </div>
</template>
