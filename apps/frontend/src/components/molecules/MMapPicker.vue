<script setup lang="ts">
import type { iMap } from "@/types/props";

const map = defineModel<iMap | null>();
const maps = {
  classic: "Classic",
  soccer: "Soccer",
  "tennis-green": "Tennis Green",
  "tennis-orange": "Tennis Orange",
} as const;
const selectedMap = ref<iMap>("classic");

const handleSelectMap = (key: iMap) => {
  selectedMap.value = key;
};

const handleConfirmMap = () => {
  map.value = selectedMap.value;
};
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <h3 class="font-bold text-2xl text-primary">Pick a map</h3>
    <ul class="flex gap-4">
      <li id="key" v-for="(map, key) in maps">
        <div
          class="card w-52 bg-base-100 shadow-xl select-none cursor-pointer"
          :class="selectedMap === key ? 'ring-2 ring-primary' : ''"
          @click.prevent="handleSelectMap(key)"
        >
          <figure><img :src="`/maps/${key}.png`" :alt="`${map} map`" /></figure>
          <div class="card-body">
            <h2 class="card-title">{{ map }}</h2>
          </div>
        </div>
      </li>
    </ul>
    <AButton class="btn-primary" text="Confirm Selection" @click.prevent="handleConfirmMap()" />
  </div>
</template>
