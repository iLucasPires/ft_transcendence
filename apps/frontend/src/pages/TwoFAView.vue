<script setup lang="ts">
const meStore = useMeStore();
const appStore = useAppStore();
</script>

<template>
  <main class="full hero card-padding">
    <div class="column separate max-w-md hero-content bg-base-200 rounded-md">
      <h1 class="title">Two Factor Authentication</h1>
      <p class="text-center">please enter your 2FA code to continue</p>
      <OtpInput
        @submit2fa="
          async (code: string) => {
            const message = await meStore.verify2FA(code);
            appStore.changeMessageLog(message);
            if (!message.includes('Error')) $router.push({ name: 'lobby' });
          }
        "
      />
    </div>
  </main>
</template>
