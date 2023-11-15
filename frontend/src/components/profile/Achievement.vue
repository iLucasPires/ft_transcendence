<script setup lang="ts">
const achievements = [
  {
    name: "dezano",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/libfte.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },

];
</script>

<template>
  <div class="w-full p-5 flex flex-col gap-5 border-2 border-neutral rounded">
    <h1 class="text-2xl font-semibold">Achievements</h1>
    <ul class="carousel rounded-box gap-4">
      <li
        class="carousel-item"
        v-for="achievement in achievements"
        :key="achievement.name"
      >
        <img :src="achievement.url" alt="Burger" />
      </li>
    </ul>
  </div>
</template>
