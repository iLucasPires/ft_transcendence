<script setup lang="ts">
import Typography from "../Typography.vue";
import Picture from "../Picture.vue";
const props = defineProps({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  picture: { type: String, required: true },
  wins: { type: Number, required: true },
  losses: { type: Number, required: true },
});
</script>

<template>
  <div class="h-full w-full border-2 border-neutral rounded p-5">
    <Typography :level="2" weight="semibold" size="2xl"> Profile </Typography>
    <div class="flex w-full h-full items-center gap-2">
      <Picture :url="picture" :alt="name" />
      <div>
        <div>
          <Typography :level="2" weight="semibold" size="xl">{{ name }}</Typography>
          <Typography :italic="true"> Level {{ level }} </Typography>
        </div>
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
