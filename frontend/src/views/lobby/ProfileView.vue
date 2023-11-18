<script setup lang="ts">
import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";
import Achievement from "@/components/profile/Achievement.vue";

import { type Ref, ref, onMounted } from "vue";
import { type iUser, type iAchievement } from "@/types/props.js";

const loading = ref(true);
const user: Ref<iUser | undefined> = ref();

onMounted(async () => {
  async function fetchUser() {
    const res = await fetch("https://randomuser.me/api/");
    const data = await res.json();
    return data.results[0];
  }
  user.value = await fetchUser();
  loading.value = false;
});

const achievements : iAchievement[] = [
  {
    name: "dezano",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/libfte.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
  {
    name: "luquinhas",
    url: "https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png",
  },
];
</script>

<template>
  <div class="w-full relative p-5">
    <div class="flex flex-col gap-5 md:h-full">
      <div class="h-2/6 flex flex-col md:flex-row gap-5 items-center">
        <UserDetail
          :name="user?.name?.first + ' ' + user?.name?.last || 'Loading...'"
          :picture="user?.picture?.large || 'https://i.pravatar.cc/'"
          :level="10"
          :wins="10"
          :losses="5"
        />
        <Achievement :achievements="achievements" />
      </div>
      <History />
    </div>
    <div v-if="loading" class="absolute inset-0 bg-base-100 z-30">
      <span
        className="relative text-primary inset-1/2 loading loading-spinner"
      ></span>
    </div>
  </div>
</template>
@/types/props
