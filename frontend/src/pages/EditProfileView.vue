<script setup lang="ts">
import { ref, type Ref } from "vue";

import { useUserStore } from "@/stores/userStore";
import { api } from "@/routes/apiRouter";

import OtpInput from "@/components/OtpInput.vue";

const useStore = useUserStore();

const totp: Ref<string> = ref("");
const selectedFile: Ref<File | null> = ref(null);
const modal: Ref<HTMLDialogElement | null> = ref(null);

const prevUsername: Ref<string> = ref(useStore.meData?.username ?? "");
const prevAvatar: Ref<string> = ref("");
const qrCode: Ref<string> = ref("");

async function handleSubmit() {
  useStore.changeMe(prevUsername.value, selectedFile.value);
}

function handleSubmit2fa() {
  if (!useStore.is2FA) useStore.change2FA(totp.value, true);
  else useStore.change2FA(totp.value, false);

  qrCode.value = "";
  modal.value?.close();
}

function showModal() {
  if (!useStore.is2FA) generateQrCode();
  modal.value?.showModal();
}

async function generateQrCode() {
  const res = await api.generate2fa();
  const blob = await res.blob();
  qrCode.value = URL.createObjectURL(blob);
}

function handleChangeAvatar(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files![0];

  selectedFile.value = file;
  prevAvatar.value = URL.createObjectURL(file);
}
</script>

<template>
  <main class="full card-padding">
    <div class="md:border-card column h-full separate center">
      <form
        class="gap-4 full center flex-col max-w-md"
        v-on:submit.prevent="handleSubmit"
      >
        <h1 class="title" v-text="'Edit Profile'" />
        <img
          alt="loading"
          class="w-32 h-32 rounded-full"
          v-bind:src="prevAvatar || useStore.meData?.avatarUrl"
          v-if="prevAvatar || useStore.meData?.avatarUrl"
        />

        <h2 class="title" v-text="useStore.meData?.username" />

        <input
          type="text"
          placeholder="Nickname"
          class="input input-bordered input-primary w-full"
          v-model="prevUsername"
        />

        <input
          type="file"
          accept="image/*"
          pattern="image/*"
          class="file-input file-input-bordered file-input-primary w-full"
          v-on:change="handleChangeAvatar"
        />
        <button
          type="submit"
          class="btn w-full btn-primary"
          v-text="'Finish'"
        />
        <span className="divider divider-primary" v-text="'2FA'" />
        <button
          type="button"
          class="btn w-full btn-primary"
          v-on:click="showModal"
          v-text="useStore.is2FA ? 'Disable' : 'Enable'"
        />
      </form>
    </div>

    <!--  Modal 2FA  -->
    <dialog class="modal" ref="modal">
      <div class="modal-box column items-center w-full gap-4">
        <h2
          class="title"
          v-text="useStore.is2FA ? 'Disable 2FA' : 'Enable 2FA'"
        />
        <p
          class="text-center"
          v-text="
            useStore.is2FA
              ? 'Please enter your 2FA code to disable 2FA'
              : 'Please scan the QR code below to enable 2FA'
          "
        />

        <img
          alt="loading"
          class="border border-primary rounded-lg h-full"
          v-if="qrCode"
          v-bind:src="qrCode"
        />
        <OtpInput
          v-model:modelValue="totp"
          v-on:submit.prevent="handleSubmit2fa"
        />
      </div>
    </dialog>
  </main>
</template>
