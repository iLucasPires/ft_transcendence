<script setup lang="ts">
const appStore = useAppStore();
defineEmits(["handleClickSearchChat", "handleClickNewGroup"]);
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm">&vellip;</div>
    <ul tabindex="0" class="dropdown-content z-10 join join-vertical p-2 w-40 bg-base-200">
      <AButton
        class="btn-ghost btn-sm join-item w-full justify-start"
        @click="appStore.changeModalSearch()"
        icon="md-search"
        text="Search"
      />
      <AButton
        class="btn-ghost btn-sm join-item w-full justify-start"
        @click="appStore.changeModalCreateGroupChannel()"
        icon="md-groups-sharp"
        text="New Group"
      />
    </ul>
  </div>
</template>
