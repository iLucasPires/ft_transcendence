<script setup lang="ts">
import { ref } from "vue";

import { useUserStore } from "@/stores/userStore";
import OtpInput from "@/components/OtpInput.vue";

const totp = ref("");
const userStore = useUserStore();
</script>

<template>
  <main class="full hero card-padding">
    <div class="column separate max-w-md hero-content bg-base-200 rounded-md">
      <h1 class="title" v-text="'Two Factor Authentication'" />
      <p
        class="text-center"
        v-text="'please enter your 2FA code to continue'"
      />
      <OtpInput
        v-model:modelValue="totp"
        v-on:submit.prevent="userStore.verify2FA(totp)"
      />
    </div>
  </main>
</template>
