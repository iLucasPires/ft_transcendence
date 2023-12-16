<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";
import type { iUser } from "@/types/props";

import CardDetailUser from "@/components/molecules/CardDetailUser.vue";
import api from "@/routes/apiRouter";

const users: Ref<iUser[]> = ref([]);

onMounted(async () => {
  const res = await api.getAllUsers();
  users.value = await api.handleResponseToJson(res);
});
</script>

<template>
  <div class="mfull p-10">
    <div class="mborder h-full p-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <ul class="overflow-y-auto flex flex-row gap-2 mt-5">
        <li
          v-for="user in users"
          :key="user.intraId"
          class="flex flex-col gap-2 mborder p-5 items-center"
        >
          <CardDetailUser
            :url="user.avatarUrl"
            :name="user.username"
            :wins="10"
            :losses="5000"
          />
          <div class="join w-full rounded">
            <button class="flex-1 btn btn-info join-item">Add friend</button>
            <button class="flex-1 btn btn-error join-item">Block</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
