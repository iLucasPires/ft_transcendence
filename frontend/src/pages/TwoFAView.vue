<script setup lang="ts">
import { ref } from "vue";

import { useAppStore } from "@/stores/appStore";
import { router } from "@/routes/vueRouter";
import { api } from "@/routes/apiRouter";
import OtpInput from "@/components/molecules/OtpInput.vue";

const totp = ref("");

async function handleActivate2fa() {
  const { changeMessageLog } = useAppStore();
  const response = await api.verify2fa(totp.value);
  if (response.ok) {
    changeMessageLog("2FA code is valid.");
    router.push({ name: "lobby" });
    return;
  }

  const { message } = await response.json();
  changeMessageLog(message);
}
</script>

<template>
  <main class="w-full h-full">
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <div
          class="card shrink-0 bg-base-100 w-full max-w-sm shadow-2xl gap-4 items-center p-5"
        >
          <h1 class="card-title">Two Factor Authentication</h1>
          <p class="text-center">
            looks like you have 2FA enabled, please enter your 2FA code to
            continue
          </p>

          <OtpInput
            v-model:modelValue="totp"
            @submit.prevent="handleActivate2fa"
          />
        </div>
      </div>
    </div>
  </main>
</template>
