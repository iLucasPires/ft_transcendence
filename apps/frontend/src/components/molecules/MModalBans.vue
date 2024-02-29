<script setup lang="ts">
import type { iUser } from "@/types/props";

const bannedUsers = defineModel<iUser[] | null>();
defineEmits(["handleUnban", "handleCloseModal"]);
</script>

<template>
  <dialog v-if="bannedUsers !== null" class="modal modal-open" @click.prevent="$emit('handleCloseModal')">
    <div class="modal-box p-5 space-y-5 overflow-hidden" @click.prevent.stop="">
      <h2 class="title">Channel Bans</h2>
      <div class="max-h-[20rem] overflow-auto">
        <ul v-if="Array.isArray(bannedUsers) && !!bannedUsers.length" class="divide-y divide-base-300">
          <li class="flex justify-between py-2" v-for="user in bannedUsers">
            <div class="flex items-center gap-2">
              <AChatImage class="h-8 w-8" :image-url="user.avatarUrl || `https://robohash.org/${user.username}.png`" />
              <span class="font-bold">{{ user.username }}</span>
            </div>
            <AButton
              class="btn-sm btn-primary mr-2"
              text="Unban"
              @click.prevent="$emit('handleUnban', user.username)"
            />
          </li>
        </ul>
        <div v-else class="flex items-center justify-center h-20">
          <span class="font-bold text-base-content/60">Nothing to see here</span>
        </div>
      </div>
    </div>
  </dialog>
</template>
