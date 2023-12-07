<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";

import useStore from "@/store";
import ProfileImage from "./ProfileImage.vue";
import Typography from "./Typography.vue";

const store = useStore();
const message: Ref<string> = ref(store.useData?.username || "");
const prevAvatar: Ref<string> = ref("");
const selectedFile: Ref<File | null> = ref(null);

async function handleSubmit() {
  store.changeMe(message.value, selectedFile.value);
  store.closeModal();
}

function handleChangeAvatar(e: Event) {
  const file = (e.target as HTMLInputElement).files![0];

  selectedFile.value = file;
  prevAvatar.value = URL.createObjectURL(file);
}

onMounted(() => {
  store.setModal();
});
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
            :url="prevAvatar || store.useData?.avatarUrl"
            :alt="store.useData?.username"
            :isInternal="prevAvatar !== null ? true : false"
          />
          <Typography size="2xl" weight="bold" :level="2">
            {{ store.useData?.username }}
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
