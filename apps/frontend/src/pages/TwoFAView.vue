<script setup lang="ts">
const totp = ref("");
const meStore = useMeStore();
const appStore = useAppStore();
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
        v-on:submit.prevent="
          async () => {
            const message = await meStore.verify2FA(totp);
            appStore.changeMessageLog(message);
            if (!message.includes('Error')) $router.push({ name: 'lobby' });
          }
        "
      />
    </div>
  </main>
</template>
