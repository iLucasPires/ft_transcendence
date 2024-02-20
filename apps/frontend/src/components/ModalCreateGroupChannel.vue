<script setup lang="ts">
import { chatSocket } from "@/socket";
import type { iCurrentChannel } from "@/types/props";

const chatStore = useChatStore();
const appStore = useAppStore();
const groupName = ref<string>("");

const handleFormSubmit = () => {
  chatSocket.emit("createGroupChat", { name: groupName.value }, (channel: iCurrentChannel) => {
    chatStore.setCurrentChat(channel);
    chatSocket.emit("fetchChannels");
    appStore.changeModalCreateGroupChannel();
    groupName.value = "";
  });
};
</script>

<template>
  <dialog
    class="modal modal-open"
    v-if="appStore.modalCreateGroupChannel"
    @click.prevent="appStore.changeModalCreateGroupChannel()"
  >
    <div class="modal-box" @click.stop="">
      <h3 class="font-bold text-xl">Create Group</h3>
      <form class="py-4" @submit.prevent="handleFormSubmit">
        <label for="group-name" class="label font-bold">Group Name</label>
        <input id="group-name" type="text" class="input input-bordered w-full" v-model="groupName" />
        <AButton class="btn-primary w-full mt-4" text="Create" />
      </form>
    </div>
  </dialog>
</template>
