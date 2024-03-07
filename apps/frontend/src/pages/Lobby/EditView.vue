<script setup lang="ts">
import { api } from "@/routes/apiRouter";
import OtpInput from "@/components/OtpInput.vue";

const meStore = useMeStore();
const appStore = useAppStore();
const selectedFile = ref<File | null>(null);
const modal = ref<HTMLDialogElement | null>(null);

const prevUsername = ref<string>("");
const prevAvatar = ref<string>("");
const qrCode = ref<string>("");

async function handleSubmit2fa(code: string) {
  const is2FA = meStore.is2FA;
  const message = await meStore.change2FA(code, !is2FA);

  appStore.changeMessageLog(message);
  if (message.includes("Error")) return;

  qrCode.value = "";
  modal.value?.close();
}

async function handleSubmit() {
  let message = "";

  if (prevUsername.value) {
    message = await meStore.changeUsername(prevUsername.value);
    appStore.changeMessageLog(message);
    prevUsername.value = "";
  }

  if (selectedFile.value) {
    message = await meStore.changeAvatar(selectedFile.value);
    appStore.changeMessageLog(message);
    selectedFile.value = null;
  }
}

function handleReset() {
  prevUsername.value = "";
  selectedFile.value = null;
  prevAvatar.value = "";
}

function showModal() {
  if (!meStore.is2FA) generateQrCode();
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
  <main class="size-full card-padding">
    <div class="md:border-card column h-full separate center">
      <form
        class="gap-4 size-full center flex-col max-w-md"
        v-on:submit.prevent="handleSubmit"
        v-on:reset="handleReset"
      >
        <h1 class="title" v-text="'Edit Profile'" />
        <div className="avatar">
          <div className="w-32 rounded-full bg-base-300">
            <img
              v-bind:src="prevAvatar || meStore.data?.avatarUrl || `https://robohash.org/${meStore.data?.username}.png`"
              v-bind:alt="`avatar of ${meStore.data?.username}`"
            />
          </div>
        </div>
        <h2 class="title" v-text="meStore.data?.username" />
        <input
          type="text"
          placeholder="Nickname"
          class="input input-sm md:input-md input-bordered input-primary w-full"
          v-model="prevUsername"
        />
        <input
          type="file"
          accept="image/*"
          pattern="image/*"
          class="file-input file-input-sm md:file-input-md file-input-bordered file-input-primary w-full"
          v-on:change="handleChangeAvatar"
        />
        <div class="flex w-full gap-2">
          <button type="submit" class="btn-full btn-primary" v-text="'Confirm'" />

          <button type="reset" class="btn-full btn-secondary" v-text="'Cancel'" />
        </div>
        <span className="divider divider-primary" v-text="'2FA'" />
        <div class="w-full">
          <button
            type="button"
            class="btn-full btn-primary"
            v-on:click="showModal"
            v-text="meStore.is2FA ? 'Disable' : 'Enable'"
          />
        </div>
      </form>
    </div>

    <!--  Modal 2FA  -->
    <dialog class="modal" ref="modal">
      <div class="modal-box column items-center gap-4">
        <h2 class="title" v-text="meStore.is2FA ? 'Disable 2FA' : 'Enable 2FA'" />
        <p
          class="text-center"
          v-text="
            meStore.is2FA ? 'Please enter your 2FA code to disable 2FA' : 'Please scan the QR code below to enable 2FA'
          "
        />
        <img alt="loading" class="border border-primary rounded-lg h-full" v-if="qrCode" v-bind:src="qrCode" />
        <OtpInput @submit2fa="handleSubmit2fa" />
      </div>
    </dialog>
  </main>
</template>
