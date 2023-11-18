<script setup lang="ts">
const props = defineProps({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  picture: { type: String, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
});
</script>

<template>
  <div class="container">
    <h2 class="title">Profile</h2>
    <div class="container-content">
      <img
        :src="picture"
        alt="Profile Picture"
        class="w-3/12 block mask mask-circle min-w-[100px] min-h-[100px]"
      />
      <div class="">
        <h3 class="text-2xl font-bold">{{ name }}</h3>
        <p class="text-xl italic">Level {{ level }}</p>
      </div>
      <div class="">
        <div class="flex flex-col items-center">
          <p class="text-xl">Wins</p>
          <p class="text-xl">{{ wins }}</p>
        </div>
        <div class="flex flex-col items-center">
          <p class="text-xl">Losses</p>
          <p class="text-xl">{{ losses }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply md:min-w-[300px] md:w-2/6 w-full h-full;
  @apply border-2 border-neutral rounded;
  @apply p-10;
}

.container-content {
  @apply flex flex-col gap-5;
}

.title {
  @apply text-2xl font-semibold;
  @apply mb-2;
}
</style>
