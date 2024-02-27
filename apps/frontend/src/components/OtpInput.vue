<script setup lang="ts">
defineEmits(["submit2fa"]);

type OtpInputEvent = InputEvent & {
  nextElementSibling?: HTMLInputElement | null;
  previousElementSibling?: HTMLInputElement | null;
};

const otpArray = ref<string[]>([]);

const handleOtpInput = (payload: Event) => {
  const env = payload as OtpInputEvent;
  const target = env.target as HTMLInputElement;
  const prevEl = target.previousElementSibling as HTMLInputElement;
  const nextEl = target.nextElementSibling as HTMLInputElement;

  if (env.data && nextEl) nextEl.focus();
  else if (!env.data && prevEl) prevEl.focus();
};
</script>

<template>
  <form
    class="column w-full separate items-center"
    v-on:reset="otpArray = []"
    v-on:submit.prevent="$emit('submit2fa', otpArray.join(''))"
  >
    <div class="flex gap-2" v-on:input="handleOtpInput($event)">
      <input
        class="input input-primary w-full"
        maxlength="1"
        required
        v-for="index in 6"
        v-model="otpArray[index - 1]"
      />
    </div>
    <div class="flex w-full gap-2">
      <button class="btn-full btn-primary" type="submit">Finish</button>
      <button class="btn-full btn-secondary" type="reset">Clear</button>
    </div>
  </form>
</template>
