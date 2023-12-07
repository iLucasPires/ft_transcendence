<script setup lang="ts">
import ProfileImage from "../ProfileImage.vue";
import Typography from "../Typography.vue";

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
  <ProfileImage :url="url" :alt="name" />
  <div class="flex flex-col gap-2">
    <Typography size="2xl" weight="bold" :level="2">{{ name }}</Typography>
    <div class="flex gap-2">
      <span
        v-for="score in scores"
        class="tooltip flex gap-2 btn btn-sm no-animation"
      >
        <Icon name="ri-ping-pong-fill" :class="score.color" />
        <Typography class="badge" :level="2">
          {{ score.name }} {{ score.value }}
        </Typography>
      </span>
    </div>
  </div>
</template>
