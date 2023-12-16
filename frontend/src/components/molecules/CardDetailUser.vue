<script setup lang="ts">
import ProfileImage from "@/components/atoms/ProfileImage.vue";

const props = defineProps({
  name: { type: String, required: true },
  url: { type: String, required: false },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
});

const scores = [
  {
    name: "Derrotas",
    icon: "ri-sword-fill",
    color: "text-red-400",
    value: props.losses,
  },
  {
    name: "Vitorias",
    icon: "ri-ping-pong-fill",
    color: "text-green-400",
    value: props.wins,
  },
];
</script>

<template>
  <div class="flex flex-col items-center md:flex-row gap-5 mborder p-5">
    <ProfileImage :url="url" :alt="name" />
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl font-bold">{{ name }}</h2>
      <div class="flex md:flex-row flex-col gap-2">
        <span
          v-for="score in scores"
          class="tooltip flex gap-2 btn btn-sm no-animation"
        >
          <Icon name="ri-ping-pong-fill" :class="score.color" />
          <h2 class="badge">{{ score.name }} {{ score.value }}</h2>
        </span>
      </div>
    </div>
  </div>
</template>
