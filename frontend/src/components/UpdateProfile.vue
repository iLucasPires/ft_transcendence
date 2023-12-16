<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";
import ProfileImage from "./ProfileImage.vue";
import Typography from "./Typography.vue";

const userStore = useUserStore();
const appStore = useAppStore();

const prevAvatar: Ref<string> = ref("");
const selectedFile: Ref<File | null> = ref(null);
const message: Ref<string> = ref(userStore.meData?.username);

async function handleSubmit() {
  userStore.changeMe(message.value, selectedFile.value);
  appStore.closeModalUpdateProfile();
}

function handleChangeAvatar(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files![0];

  selectedFile.value = file;
  prevAvatar.value = URL.createObjectURL(file);
}
</script>

<template>
  <dialog class="modal" id="modalUpdate">
    <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form class="card-body" @submit.prevent="handleSubmit">
        <Typography
          size="2xl"
          :level="2"
          weight="bold"
          extra-class="text-center"
        >
          Update Profile
        </Typography>

        <div class="container-center-row gap-1 m-5">
          <ProfileImage
            :url="prevAvatar || userStore.meData?.avatarUrl"
            :alt="userStore.meData?.username"
            :isInternal="prevAvatar !== null ? true : false"
          />
          <Typography size="2xl" weight="bold" :level="2">
            {{ userStore.meData?.username }}
          </Typography>
        </div>
        <input
          type="text"
          v-model="message"
          placeholder="Nickname"
          class="input input-bordered input-primary w-full max-w-xs"
        />
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          pattern="image/*"
          class="file-input file-input-bordered file-input-primary w-full max-w-xs"
          @change="handleChangeAvatar"
        />
        <button class="btn btn-primary">Finish</button>
      </form>
    </div>
  </dialog>
</template>
