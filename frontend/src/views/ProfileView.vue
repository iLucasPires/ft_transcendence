<script setup lang="ts">
import { ref } from "vue";
import type { Ref } from "vue";

import api from "@/api";
import useStore from "@/store";

import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";

const modalEditProfile: Ref<HTMLDialogElement | null> = ref(null);
const message: Ref<string> = ref("");
const store = useStore();

function handleClick() {
  api.updateUsernameMe(store.useData?.username, message.value);
  store.setMe();
}
</script>

<template>
  <dialog ref="modalEditProfile" class="modal">
    <div class="modal-box flex flex-col gap-5">
      <form method="dialog">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input
            v-model="message"
            type="text"
            class="input input-bordered"
            placeholder="Username"
          />
        </div>
        <div class="modal-action">
          <button @click="handleClick" class="btn btn-primary">Save</button>
          <button @click="modalEditProfile?.close()" class="btn">Cancel</button>
        </div>
      </form>
    </div>
  </dialog>

  <div class="flex flex-col overflow-hidden items-center p-10 w-full gap-5">
    <UserDetail
      :name="store.useData?.username"
      picture="https://picsum.photos/200/300"
      :level="10"
      :wins="10"
      :losses="5"
    />
    <button
      @click="() => modalEditProfile?.showModal()"
      class="btn btn-primary absolute z-20 right-16 top-16"
    >
      Edit Profile
    </button>
    <History />
  </div>
</template>
