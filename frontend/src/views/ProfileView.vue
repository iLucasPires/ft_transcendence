<script setup lang="ts">
import useStore from "@/store";
import History from "@/components/profile/History.vue";
import UserDetail from "@/components/profile/UserDetail.vue";

const store = useStore();

function handleOpenModal() {
  store.openModal();
}
</script>

<template>
  <div class="flex flex-col overflow-hidden items-center w-full gap-5 p-10">
    <UserDetail
      :picture="store.useData?.avatarUrl ?? ''"
      :name="store.useData?.username"
      :wins="10"
      :losses="5"
    />
    <button
      @click="handleOpenModal()"
      class="btn btn-primary btn-sm absolute z-20 right-16 top-16"
    >
      <Icon name="md-modeedit" />
    </button>
    <History />
  </div>
</template>
