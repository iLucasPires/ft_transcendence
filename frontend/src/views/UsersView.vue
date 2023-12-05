<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Ref } from "vue";
import type { iUser } from "@/types/props";

import Loading from "@/components/Loading.vue";
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
  <div class="w-full h-full justify-center p-10">
    <div class="border-2 border-base-300 rounded h-full p-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <Loading v-if="loading" :loading="loading" />
      <div v-else class="overflow-y-auto"></div>
    </div>
  </div>
</template>
