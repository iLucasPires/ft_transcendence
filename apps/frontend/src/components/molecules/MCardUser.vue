<script setup lang="ts">
import type { iUser } from "@/types/props";
import { useAppStore } from "@/stores/appStore";

defineProps<{ user: iUser }>();
defineEmits(["handleSendMessage", "handleBlock", "handleAdd", "showProfile"]);

const appStore = useAppStore();
</script>

<template>
  <li class="column separate items-center relative border rounded-md"
    :class="user.isFriendsWith ? 'border-primary' : 'border-base-300'"
  >
    <AAvatar :username="user.username" :avatarUrl="user.avatarUrl" :isConnected="user.isConnected" />
    <h2 class="title">{{ user.username }}</h2>
    <div class="wrap gap-2">
      <div class="btn btn-sm">Wins<span class="badge badge-primary">10</span></div>
      <div class="btn btn-sm">Losses<span class="badge badge-primary">10</span></div>
    </div>

    <div class="dropdown dropdown-end z-50 absolute top-5 right-5">
      <div tabindex="0" role="button" class="btn btn-sm">&vellip;</div>
      <div tabindex="0" class="bg-base-200 dropdown-content mt-2 shadow rounded-box w-52 flex flex-col gap-2 p-2">
        <AButton
          v-if="appStore.tab !== 'blocked'"
          icon="md-personaddalt1"
          :text="user.isFriendsWith ? 'Unfriend' : 'Add Friend'"
          class="w-full btn-sm justify-start"
          @click="$emit('handleAdd', user.username)"
        />
        <AButton
          icon="md-block"
          :text="appStore.tab === 'blocked' ? 'Unblock' : 'Block'"
          class="w-full btn-sm justify-start"
          @click="$emit('handleBlock', user.username)"
        />
      </div>
    </div>

    <div class="w-full flex gap-2">
      <AButton
        text="Send Message"
        icon="md-message"
        class="flex-1 btn-primary"
        @click="$emit('handleSendMessage', user.username)"
      />
      <AButton text="View Profile" icon="md-person" class="flex-1 btn-secondary" @click="$emit('showProfile')" />
    </div>
  </li>
</template>
