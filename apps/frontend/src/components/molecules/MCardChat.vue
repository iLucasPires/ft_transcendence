<script setup lang="ts">
defineProps<{
    avatarUrl: string;
    author : string;
    content: string;
}>();
</script>

<template>
  <li class="border-card p-4 my-2">
    <div class=" flex items-center gap-2">
      <div class="avatar">
        <div class="w-16 rounded-full bg-base-200">
            <img
                :src="avatarUrl || `https://robohash.org/${author}.png`"
                :alt="`avatar of ${author}`"
            />
        </div>
      </div>
      <div class="overflow-hidden">
        <h2 class="text-md font-bold" v-text="author" />
        <p class="text-md text-pretty break-words whitespace-pre-wrap" v-text="content" />
      </div>
    </div>
  </li>
</template>
