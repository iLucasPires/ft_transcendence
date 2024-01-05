<script setup lang="ts">
import ProfileImage from "@/components/atoms/ProfileImage.vue";

defineProps({
  name: { type: String, required: true },
  url: { type: String, required: false },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
});
</script>

<template>
  <div class="flex flex-col items-center md:flex-row gap-5">
    <ProfileImage :url="url" :alt="name" />
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold">{{ name }}</h2>
      <ul class="flex md:flex-row flex-wrap gap-2 flex-col w-full">
        <li class="tooltip flex flex-grow btn btn-sm no-animation">
          <Icon name="ri-ping-pong-fill" class="text-red-400" />
          <span class="badge">Defeats {{ losses }}</span>
        </li>
        <li class="tooltip flex flex-grow btn btn-sm no-animation">
          <Icon name="ri-ping-pong-fill" class="text-green-400" />
          <span class="badge">Victories {{ wins }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
