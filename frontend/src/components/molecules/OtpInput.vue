<script setup lang="ts">
import { ref } from "vue";

const otpArray = ref<string[]>([]);
const emit = defineEmits(["update:modelValue"]);

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

function handleReset() {
  otpArray.value.forEach((_, index) => {
    otpArray.value[index] = "";
  });
}

function handleSubmit() {
  emit("update:modelValue", otpArray.value.join(""));
  handleReset();
}

</script>

<template>
  <form
    @reset="handleReset"
    @submit.prevent="handleSubmit"
    class="flex flex-col w-full gap-4 items-center p-5"
  >
    <div class="flex gap-2" @input="handleOtpInput">
      <input
        v-for="index in 6"
        v-model="otpArray[index - 1]"
        class="input input-primary w-full"
        maxlength="1"
        required
      />
    </div>
    <div class="join w-full">
      <button class="btn btn-primary flex-1 join-item">finish</button>
      <button type="reset" class="btn btn-secondary flex-1 join-item">
        clear
      </button>
    </div>
  </form>
</template>
