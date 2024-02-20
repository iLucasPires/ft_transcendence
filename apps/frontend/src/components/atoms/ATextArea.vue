<script setup lang="ts">
const message = ref<string>("");
const emits = defineEmits(["sendMessage"]);
</script>

<template>
  <textarea
    type="text"
    name="message"
    class="bg-base-300  h-12 textarea w-full resize-none"
    placeholder="Type a message"
    v-model="message"
    @input="
      (event: any) => {
        event.target.style.height = '18px';
        event.target.style.height = event.target.scrollHeight + 'px';
      }
    "
    @keydown.enter.exact.prevent="
      (event: any) => {
        $emit('sendMessage', message.trim());
        event.target.style.height = '18px';
        message = '';
      }
    "
  />
</template>
