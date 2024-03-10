<script setup lang="ts">
const props = defineProps<{
  username: string;
  avatarUrl?: string;
  isConnected?: boolean;
  size?: string;
}>();

const getAvatar = () => props.avatarUrl || `https://robohash.org/${props.username}.png`;
</script>

<template>
  <div :class="`avatar w-${size ?? '24'} ${isConnected ? 'online' : 'offline'}`">
    <div class="rounded-full bg-base-200">
      <img :src="getAvatar()" :alt="`avatar of ${username}`" />
    </div>
  </div>
</template>
