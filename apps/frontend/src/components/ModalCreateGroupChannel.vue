<script setup lang="ts">
import { useChatStore } from "@/stores/chatStore";
import { ref } from "vue";

defineProps<{ isOpen: boolean }>();
const emit = defineEmits(["closeModal"]);

const chatStore = useChatStore();
const groupName = ref<string>("");
const groupMembers = ref<string>("");

const handleFormSubmit = () => {
  // TODO: get users id from groupMembers
  chatStore.createGroupChat(groupName.value, []);
  emit("closeModal");
};
</script>

<template>
  <dialog class="modal modal-open" v-if="isOpen" @click.prevent="$emit('closeModal')">
    <div class="modal-box" @click.stop="">
      <h3 class="font-bold text-xl">Create Group</h3>
      <form class="py-4" @submit.prevent="handleFormSubmit">
        <label for="group-name" class="label font-bold">Group Name</label>
        <input id="group-name" type="text" class="input input-bordered w-full" v-model="groupName" />
        <label for="group-members" class="label font-bold">Members</label>
        <input id="group-members" type="text" class="input input-bordered w-full" v-model="groupMembers" />
        <AButton class="btn-primary w-full mt-4" text="Create" />
      </form>
    </div>
  </dialog>
</template>
