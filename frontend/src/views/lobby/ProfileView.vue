<script setup lang="ts">
import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";
import Achievement from "@/components/profile/Achievement.vue";

import { ref, onMounted } from "vue";
import type { Ref } from "vue";

type iUser = {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
};

const user: Ref<iUser | undefined> = ref();

onMounted(async () => {
  async function fetchUser() {
    const res = await fetch("https://randomuser.me/api/");
    const data = await res.json();
    return data.results[0];
  }
  user.value = await fetchUser();
});
</script>

<template>
  <div class="flex flex-col gap-5 w-full h-full p-5">
    <div class="flex flex-col md:flex-row items-center gap-5">
      <UserDetail
        :name="user?.name?.first + ' ' + user?.name?.last"
        :picture="user?.picture?.large || ''"
        :level="10"
      />
      <Achievement />
    </div>
    <History />
  </div>
</template>
