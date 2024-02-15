<script setup lang="ts">
defineEmits(["handleClickSearchChat", "handleClickNewGroup"]);
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm">&vellip;</div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
      <li @click="$emit('handleClickSearchChat')">
        <a> <Icon name="md-search" />Search </a>
      </li>
      <li>
        <a @click="$emit('handleClickNewGroup')">
          <Icon name="md-groups-sharp" />
          New group
        </a>
      </li>
    </ul>
  </div>
</template>
