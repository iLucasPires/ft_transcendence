<script setup lang="ts">
export interface iAchievement {
  name: string;
  url: string;
}

defineProps({
  achievements: {
    type: Array<iAchievement>,
    required: true,
  },
});
</script>

<template>
  <div
    class="h-full w-full p-5 flex flex-col border-2 border-base-300 overflow-hidden rounded"
  >
    <Typography :level="2" size="2xl" weight="semibold" class="mb-5">
      Achievements
    </Typography>

    <ul class="carousel gap-5">
      <li class="carousel-item" :key="achievement.name" v-for="achievement in achievements">
        <Picture size="md" :url="achievement.url" :alt="achievement.name" />
      </li>
    </ul>
  </div>
</template>
