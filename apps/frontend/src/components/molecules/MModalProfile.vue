<script setup lang="ts">
import type { iUser } from "@/types/props";

defineProps<{ user: iUser }>();
defineEmits(["clickClose"]);


</script>

<template>
  <dialog class="modal modal-open" @keydown.esc="$emit('clickClose')">
    <div class="modal-box relative flex flex-col items-center gap-4 p-4">
      <AAvatar :username="user.username" :avatarUrl="user.avatarUrl" :isConnected="user.isConnected" />
      <h2 class="title">{{ user.username }}</h2>
      <ul class="wrap gap-2">
        <li class="btn btn-sm">Wins<span class="badge badge-primary">10</span></li>
        <li class="btn btn-sm">Losses<span class="badge badge-primary">10</span></li>
      </ul>
      <button @click="$emit('clickClose')" class="btn btn-sm absolute top-5 right-5">&times;</button>

      <div class="overflow-auto h-full w-full">
        <table className="table">
          <thead>
            <tr>
              <th>Emeny</th>
              <th>Date</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody class="">
            <tr>
              <td>Cy Ganderton</td>
              <td>12/16/2020</td>
              <td>Blue</td>
            </tr>
            <tr>
              <td>Cy Ganderton</td>
              <td>12/16/2020</td>
              <td>Blue</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </dialog>
</template>
