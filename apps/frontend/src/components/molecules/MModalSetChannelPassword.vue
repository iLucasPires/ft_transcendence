<script setup lang="ts">
import { chatSocket } from "@/socket";
import type { iChannel } from "@/types/props";

const channel = defineModel<iChannel | null>();
const emit = defineEmits(["handleClose"]);

const newChatPassword = ref<string>("");
const currentChatPassword = ref<string>("");
const removePassword = ref<boolean>(false);

const handleFormSubmit = () => {
  if (!channel.value) {
    return;
  }
  if (removePassword.value) {
    chatSocket.emit(
      "removeChannelPassword",
      { channelId: channel.value.id, password: currentChatPassword.value },
      () => {
        close();
      },
    );
    return;
  }
  const data: Record<string, any> = {
    channelId: channel.value.id,
    newPassword: newChatPassword.value,
  };
  if (channel.value.visibility === "private") {
    data.currentPassword = currentChatPassword.value;
  }
  chatSocket.emit("setChannelPassword", data, () => {
    close();
  });
};

const resetForm = () => {
  newChatPassword.value = "";
  currentChatPassword.value = "";
  removePassword.value = false;
};

const close = () => {
  emit("handleClose");
  resetForm();
};
</script>

<template>
  <dialog class="modal modal-open" v-if="!!channel" @click.prevent="close()">
    <div class="modal-box" @click.stop="">
      <h3 class="font-bold text-xl">
        <template v-if="channel.visibility === 'public'">Set Channel Password</template>
        <template v-else>Change Channel Password</template>
      </h3>
      <form class="py-4" v-on:submit.prevent="handleFormSubmit">
        <template v-if="channel.visibility === 'private'">
          <label for="remove-password" class="label font-bold cursor-pointer justify-start">
            <input
              id="remove-password"
              type="checkbox"
              class="checkbox mr-2"
              v-model="removePassword"
              @change="newChatPassword = removePassword ? '' : newChatPassword"
            />
            Remove Channel Password
          </label>
          <label for="current-password" class="label font-bold">Current Password</label>
          <input
            id="current-password"
            type="password"
            class="input input-bordered w-full mb-1"
            v-model="currentChatPassword"
          />
        </template>
        <label for="new-password" class="label font-bold">New Password</label>
        <input
          id="new-password"
          type="password"
          autocomplete="new-password"
          class="input input-bordered w-full mb-1"
          :disabled="channel.visibility === 'private' && removePassword"
          v-model="newChatPassword"
        />
        <AButton class="btn-primary w-full mt-4" text="Submit" />
      </form>
    </div>
  </dialog>
</template>
