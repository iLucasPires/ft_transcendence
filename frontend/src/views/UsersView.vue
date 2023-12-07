<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import type { iUser } from "@/types/props";

import Loading from "@/components/Loading.vue";
import UserDetail from "@/components/profile/UserDetail.vue";
import api from "@/api";

const loading: Ref<boolean> = ref(true);
const users: Ref<Array<iUser>> = ref([]);
const userSelected: Ref<iUser | null> = ref(null);
const modal: Ref<HTMLDialogElement | null> = ref(null);

onMounted(async function () {
  users.value = await api.getAllUsers();

  loading.value = false;
});

function handleClickModalDetails(user: iUser) {
  userSelected.value = user;
  modal?.value?.showModal();
}
</script>

<template>
  <div class="w-full h-full p-10">
    <div class="border-2 border-base-300 rounded h-full p-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <Loading v-if="loading" :loading="loading" />
      <ul v-else class="overflow-y-auto flex flex-col gap-2 mt-5">
        <li
          v-for="user in users"
          :key="user.intraId"
          class="flex flex-col md:flex-row w-full justify-between items-center gap-5 p-5 border-2 border-base-300 rounded"
        >
          <div class="flex flex-row items-center gap-5">
            <UserDetail
              :url="user.avatarUrl ?? ''"
              :name="user.username"
              :wins="10"
              :losses="5000"
            />
          </div>
          <div class="join">
            <button class="btn btn-primary join-item">
              Add Friend
              <Icon name="md-info-round" />
            </button>
            <button class="btn btn-error join-item">
              Block
              <Icon name="md-block" />
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
