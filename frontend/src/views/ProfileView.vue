<script setup lang="ts">
import useStore from "@/store";

import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";
import Achievement from "@/components/profile/Achievement.vue";
import Loading from "@/components/Loading.vue";

import { type Ref, ref, onMounted } from "vue";
import { type iAchievement } from "@/types/props.js";

const achievements: iAchievement[] = [];
const loading: Ref<boolean> = ref(true);
const user = useStore();

onMounted(async () => {
  loading.value = false;
});
</script>

<template>
  <div class="flex flex-col overflow-hidden items-center p-10 w-full">
    <Loading :loading="loading" />
    <div v-if="!loading" class="flex flex-col w-full h-full">
      <div
        class="flex flex-col md:flex-row items-center w-full my-5 gap-5 h-72"
      >
        <UserDetail
          :name="user.useData?.name?.first || 'User'"
          :picture="user?.useData?.picture?.large || ''"
          :level="10"
          :wins="10"
          :losses="5"
        />
        <Achievement :achievements="achievements" />
      </div>
      <History />
    </div>
  </div>
</template>
