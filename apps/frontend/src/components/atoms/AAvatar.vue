<script setup lang="ts">
const props = defineProps<{
  username: string;
  avatarUrl?: string;
  isConnected?: boolean;
}>();

const getAvatar = () => props.avatarUrl || `https://robohash.org/${props.username}.png`;
</script>

<template>
  <div class="avatar w-24 " :class="isConnected ? 'online' : 'offline'">
    <div class="rounded-full bg-base-200">
      <img :src="getAvatar()" :alt="`avatar of ${username}`" />
    </div>
  </div>
</template>
