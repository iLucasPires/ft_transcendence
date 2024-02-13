<script setup lang="ts">
import { ref, watch } from "vue";

defineProps({ isOpen: Boolean });
defineEmits(["closeModal"]);

const search = ref<string>("");
const options = ref<{ name: string; tags: string[] }[]>([
  {
    name: "Test",
    tags: ["dm"],
  },
  {
    name: "Test",
    tags: ["group", "public"],
  },
]);

const useDebounce = () => {
  let timeout: number | null = null;
  return function (fnc: Function, delayMs: number = 500) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fnc();
    }, delayMs);
  };
};
const debounce = useDebounce();

watch(search, () => {
  debounce(() => console.log("Searching channels"));
});
</script>

<template>
  <dialog v-if="isOpen" class="modal modal-open" @click.prevent="$emit('closeModal')">
    <div class="modal-box" @click.stop="">
      <h3 class="font-bold text-xl mb-2">Search</h3>
      <input type="text" class="input input-primary w-full mb-2" placeholder="Search chat" v-model="search" />
      <div class="overflow-y-auto max-h-96 grid items-center" :class="!options.length && 'h-48'">
        <ul v-if="options.length" class="w-full">
          <li v-for="option in options" class="p-4 border border-base-300 mt-2">
            <div class="flex gap-4 items-center">
              <div class="avatar w-16">
                <div class="rounded-full bg-base-200">
                  <img :src="`https://robohash.org/${option.name}.png`" :alt="`channel image`" />
                </div>
              </div>
              <div>
                <div class="text-xl text-base-content">{{ option.name }}</div>
                <ul class="flex gap-2">
                  <li v-for="tag in option.tags" :key="tag" class="badge badge-primary">{{ tag }}</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <span v-else class="text-xl text-neutral font-bold mx-auto text-center"> Not found </span>
      </div>
    </div>
  </dialog>
</template>
