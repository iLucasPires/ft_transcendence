<script setup lang="ts">
import { ref } from "vue";

const otpArray = ref<string[]>([]);

type OtpInputEvent = InputEvent & {
  nextElementSibling?: HTMLInputElement | null;
  previousElementSibling?: HTMLInputElement | null;
};

function handleOtpInput(payload: Event) {
  const env = payload as OtpInputEvent;
  const target = env.target as HTMLInputElement;
  const prevEl = target.previousElementSibling as HTMLInputElement;
  const nextEl = target.nextElementSibling as HTMLInputElement;

  if (env.data && nextEl) nextEl.focus();
  else if (!env.data && prevEl) prevEl.focus();
}
</script>

<template>
  <form
    class="column w-full separate items-center"
    v-on:reset="otpArray = []"
    v-on:submit.prevent="$emit('update:modelValue', otpArray.join(''))"
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
      <button class="btn-full btn-primary" v-text="'Finish'" type="submit" />
      <button class="btn-full btn-secondary" type="reset" v-text="'Clear'" />
    </div>
  </form>
</template>
