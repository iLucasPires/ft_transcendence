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
  <div
    class="h-full w-full border-2 border-base-300 rounded flex p-5 flex-col items-center"
  >
    <Typography :level="2" weight="semibold" size="2xl" extraClass="self-start">
      Profile
    </Typography>
    <div class="flex items-center gap-5 h-full w-full">
      <Picture :url="picture" :alt="name" />
      <div class="">
        <Typography :level="2" weight="semibold" size="xl">{{
          name
        }}</Typography>
        <Typography :italic="true"> Level {{ level }} </Typography>

        <div class="flex gap-2">
          <span class="tooltip flex" data-tip="Vitórias">
            <Icon name="ri-ping-pong-fill" class="text-green-400" />
            <Typography :level="2">{{ wins }}</Typography>
          </span>
          <span class="tooltip flex" data-tip="Derrotas">
            <Icon name="ri-ping-pong-fill" class="text-red-400" />
            <Typography :level="2">{{ losses }}</Typography>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
