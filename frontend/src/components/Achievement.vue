<script setup lang="ts">
  const achievements = [{name:"dezano", url:"https://github.com/byaliego/42-project-badges/raw/main/badges/libfte.png"},
                         {name:"luquinhas", url:"https://github.com/byaliego/42-project-badges/raw/main/badges/so_longe.png"}]  

</script>

<template>
  <div class="w-full h-full border-2 border-neutral p-2">
    <h2 class="font-bold text-2xl"> Achievement </h2>
    <ul class="flex w-full h-full items-center ">
      <li v-for="item in achievements">
      <img :src="item.url " class="w-full h-full"/>
      </li>
    </ul>
  </div>
</template>
