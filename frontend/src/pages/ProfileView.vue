<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import History from "@/components/molecules/CardHistoryUser.vue";
import CardDetailUser from "@/components/molecules/CardDetailUser.vue";

const { meData } = useUserStore();
</script>

<template>
  <div class="mfull p-10">
    <div class="overflow-hidden mfull gap-5 relative mborder p-5">
      <div class="flex flex-col justify-center  md:flex-row items-center md:justify-between gap-5 mb-5">
        <CardDetailUser
          class="flex-1"
          :url="meData?.avatarUrl ?? ''"
          :name="meData?.username"
          :wins="10"
          :losses="5"
        />
        <div class="join">
          <button
            @click="$router.push('/profile/edit')"
            class="btn btn-primary join-item"
          >
            Edit Profile
          </button>
          <button class="btn btn-secondary join-item">Change Status</button>
        </div>
      </div>
      <History class="mfull" />
    </div>
  </div>
</template>
