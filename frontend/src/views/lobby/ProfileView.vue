<script setup lang="ts">
import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";
import Achievement from "@/components/profile/Achievement.vue";
import Loading from "@/components/Loading.vue";

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

const achievements: iAchievement[] = [
  {
    name: "Achievement 1",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 2",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
  {
    name: "Achievement 3",
    url: "https://i.pravatar.cc/",
  },
];
</script>

<template>
  <div class="flex flex-col overflow-hidden items-center p-10 w-full"
  >
    <Loading :loading="loading" />
    <div v-if="!loading" class="flex flex-col w-full  h-full">
      <div class="flex flex-col md:flex-row items-center w-full my-5 gap-5 ">
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
  </div>
</template>
