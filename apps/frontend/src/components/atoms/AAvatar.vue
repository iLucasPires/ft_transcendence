<script setup lang="ts">
const props = defineProps<{
  username: string;
  avatarUrl?: string;
  isConnected?: boolean;
  size?: string;
}>();

const getAvatar = () => props.avatarUrl || `https://robohash.org/${props.username}.png`;
const getAvatarSize = () => `w-${props.size ?? "24"}`;
</script>

<template>
  <div :class="`avatar ${isConnected ? 'online' : 'offline'} ${getAvatarSize()}`">
    <div :class="`rounded-full bg-base-200`">
      <img :src="getAvatar()" :alt="`avatar of ${username}`" />
    </div>
  </div>
</template>
