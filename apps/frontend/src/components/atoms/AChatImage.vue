<script setup lang="ts">
defineProps<{imageUrl: string}>();
</script>

<template>
    <div class="avatar w-16 rounded-full bg-base-200 overflow-hidden">
        <img :src="imageUrl" alt="Chat image" />
    </div>
</template>