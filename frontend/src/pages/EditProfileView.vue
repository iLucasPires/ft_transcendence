<script setup lang="ts">
import { ref, type Ref } from "vue";

import { useUserStore } from "@/stores/userStore";
import { api } from "@/routes/apiRouter";

import ProfileImage from "@/components/atoms/ProfileImage.vue";
import OtpInput from "@/components/molecules/OtpInput.vue";

const useStore = useUserStore();

const totp: Ref<string> = ref("");
const selectedFile: Ref<File | null> = ref(null);
const modal: Ref<HTMLDialogElement | null> = ref(null);

const prevUsername: Ref<string> = ref(useStore.meData?.username);
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
  <main class="flex items-center justify-center h-full w-full">
    <div class="flex p-10 bg-base-200 rounded-md gap-4 items-center">
      <form
        class="mflex-col items-center gap-4 w-full h-full"
        @submit.prevent="handleSubmit"
      >
        <h1 class="text-2xl font-bold">Edit Profile</h1>
        <ProfileImage
          :url="prevAvatar || useStore.meData?.avatarUrl"
          :alt="useStore.meData?.username"
          :isInternal="prevAvatar !== ''"
        />

        <input
          type="text"
          v-model="prevUsername"
          placeholder="Nickname"
          class="input input-bordered input-primary w-full"
        />

        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          pattern="image/*"
          class="file-input file-input-bordered file-input-primary w-full"
          @change="handleChangeAvatar"
        />

        <button type="submit" class="btn btn-primary w-full">Finish</button>
        <span className="divider divider-primary">2FA</span>
        <button @click="showModal" type="button" class="w-full btn btn-primary">
          {{ useStore.is2FA ? "Disable" : "Enable" }}
        </button>
      </form>

      <dialog ref="modal" class="modal">
        <div class="modal-box w-full flex flex-col items-center gap-4">
          <h2 class="text-xl">
            {{ useStore.is2FA ? "Disable" : "Enable" }} 2FA
          </h2>
          <p class="text-center">
            {{
              useStore.is2FA
                ? "Please enter your 2FA code to disable 2FA"
                : "Please scan the QR code below to enable 2FA"
            }}
          </p>

          <img
            v-if="qrCode"
            :src="qrCode"
            alt="loading"
            class="border h-full border-primary rounded-lg"
          />
          <OtpInput
            v-model:modelValue="totp"
            @submit.prevent="handleSubmit2fa"
          />
        </div>
      </dialog>
    </div>
  </main>
</template>
