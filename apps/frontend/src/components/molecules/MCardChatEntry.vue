<script setup lang="ts">
import type { iChannel } from "@/types/props";
import { useChatStore } from "@/stores/chatStore";

const chatStore = useChatStore();

defineProps<{chat: iChannel, isCurrentChat: boolean}>();
defineEmits(["handleClickChat"])

</script>

<template>
    <li
        class="flex items-center separate cursor-pointer border-card"
        :class="isCurrentChat && 'border-primary'"
        @click="$emit('handleClickChat')"
    >
        <AChatImage :image-url="chatStore.getChatPhoto(chat)" />
        <h2 class="title" v-text="chatStore.getChatName(chat)" />
    </li>
</template>