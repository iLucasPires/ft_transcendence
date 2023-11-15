<script setup lang="ts">
import History from "@/components/History.vue";
import UserDetail from "@/components/UserDetail.vue";
import Achievement from "@/components/Achievement.vue";
</script>

<template>
  <div class="flex flex-col gap-5 w-full h-full p-5">
    <div class="flex flex-col md:flex-row items-center gap-5">
      <UserDetail />
      <Achievement />
    </div>
    <History />
  </div>
</template>
