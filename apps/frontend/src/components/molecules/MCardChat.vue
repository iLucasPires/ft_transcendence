<script setup lang="ts">
import type { iMessage } from "@/types/props";

defineProps<{
    avatarUrl: string;
    author : string;
    content: string;
}>();
</script>

<template>
  <li class="border-card p-4">
    <div class="max-w-5xl flex items-center gap-2">
      <div class="avatar">
        <div class="w-16 rounded-full bg-base-200">
            <img
                :src="avatarUrl || `https://robohash.org/${author}.png`"
                :alt="`avatar of ${author}`"
            />
        </div>
      </div>
      <div class="w-full">
        <h2 class="text-md font-bold" v-text="author" />
        <p class="text-md text-pretty break-words whitespace-pre-wrap" v-text="content" />
      </div>
    </div>
  </li>
</template>
