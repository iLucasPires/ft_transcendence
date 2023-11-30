<script setup lang="ts">
import { ref, onMounted } from "vue";
import Loading from "@/components/Loading.vue";
import type { Ref } from "vue";
import type { iUser } from "@/types/props";
import UserDetail from "@/components/profile/UserDetail.vue";
import History from "@/components/profile/History.vue";
import api from "@/api";

const loading: Ref<boolean> = ref(true);
const users: Ref<Array<iUser>> = ref([]);
const userSelected: Ref<iUser | null> = ref(null);
const modal: Ref<HTMLDialogElement | null> = ref(null);

onMounted(async () => {
  users.value = await api.getAllUsers();
  loading.value = false;
});
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box flex flex-col gap-5 w-11/12 max-w-5xl">
      <button
        @click="() => modal?.close()"
        class="btn btn-primary self-end absolute z-20 right-10 top-10"
      >
        Close
      </button>

      <UserDetail
        :name="userSelected?.username ?? ''"
        picture="https://picsum.photos/200/300"
        :level="10"
        :wins="10"
        :losses="5"
      />
      <History />
    </div>
  </dialog>

  <div class="w-full h-full justify-center p-10">
    <div class="border-2 border-base-300 rounded h-full p-5">
      <h1 class="text-2xl font-bold">Users</h1>
      <Loading v-if="loading" :loading="loading" />
      <div v-else class="overflow-y-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.intraId">
              <td>
                <Picture alt="user avatar" />
              </td>
              <td>
                <div class="font-bold">{{ user.username }}</div>
              </td>
              <td>{{ "offline" }}</td>
              <td>
                <button
                  @click="
                    () => {
                      userSelected = user;
                      modal?.showModal();
                    }
                  "
                  class="btn btn-primary"
                >
                  details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
