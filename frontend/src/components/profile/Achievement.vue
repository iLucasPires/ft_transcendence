<script setup lang="ts">
export interface iAchievement {
  name: string;
  url: string;
};

defineProps({
  achievements: {
    type: Array as PropType<iAchievement[]>,
    required: true,
  },
});
</script>

<template>
  <div class="p-10 w-full md:w-4/6 h-full border-2 border-neutral rounded">
    <h2 class="text-2xl font-semibold mb-5">Achievements</h2>
    <ul class="carousel rounded-box">
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
@/types/props
