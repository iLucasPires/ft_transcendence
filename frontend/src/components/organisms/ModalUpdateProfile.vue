<script setup lang="ts">
import { ref, type Ref } from "vue";

import { useUserStore } from "@/stores/userStore";
import { useAppStore } from "@/stores/appStore";
import ProfileImage from "@/components/atoms/ProfileImage.vue";

const userStore = useUserStore();

const selectedFile: Ref<File | null> = ref(null);
const prevAvatar: Ref<string> = ref("");
const prevNickname: Ref<string> = ref(userStore.meData?.username);

async function handleSubmit() {
  userStore.changeMe(prevNickname.value, selectedFile.value);
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
      <div class="card-body">
        <h2 class="text-2xl font-bold text-center mb-5">Update Profile</h2>
        <form
          class="mflex-col items-center gap-2"
          @submit.prevent="handleSubmit"
        >
          <ProfileImage
            :url="prevAvatar || userStore.meData?.avatarUrl"
            :alt="userStore.meData?.username"
            :isInternal="prevAvatar !== null ? true : false"
          />
          <h2 class="text-2xl text-center font-medium mb-5">
            {{ userStore.meData?.username }}
          </h2>

          <input
            type="text"
            v-model="prevNickname"
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
          <button class="btn btn-primary w-full">Finish</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
