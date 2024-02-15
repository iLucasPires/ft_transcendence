<script setup lang="ts">
import { useChatStore } from "@/stores/chatStore";
import { chatSocket } from "@/socket";
import type { iChannelSearchResult, iCurrentChannel } from "@/types/props";
import { onMounted, ref, watch } from "vue";

defineProps({ isOpen: Boolean });
const emit = defineEmits(["closeModal"]);

const chatStore = useChatStore();

const search = ref<string>("");
const options = ref<iChannelSearchResult[]>([]);
const selectedOption = ref<iChannelSearchResult | null>(null);

const useDebounce = () => {
  let timeout: number | null = null;
  return function (fnc: Function, delayMs: number = 500) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fnc();
    }, delayMs);
  };
};
const debounce = useDebounce();

const handleEsc = () => {
  search.value = "";
  selectedOption.value = null;
  emit("closeModal");
};

const handleClick = () => {
  const channel = selectedOption.value;
  search.value = "";
  selectedOption.value = null;
  if (channel === null) {
    return;
  }
  const events = { dm: "enterDmChat", group: "enterGroupChat" };
  const event = events[channel.type];
  const isDm = channel.type === "dm";
  const isMember = !isDm && channel.tags.includes("member");

  if (isDm || isMember) {
    chatSocket.emit(event, isDm ? channel.name : channel.id, (channel: iCurrentChannel) => {
      chatStore.currentChat = channel;
      chatSocket.emit("fetchChannels");
    });
  } else {
    chatSocket.emit("joinGroupChat", channel.id, (channel: iCurrentChannel) => {
      chatStore.currentChat = channel;
      chatSocket.emit("fetchChannels");
    });
  }
  emit("closeModal");
};

watch(search, () => debounce(() => chatSocket.emit("searchChannels", search.value), 300));
onMounted(() => {
  chatSocket.on("searchResults", (results: iChannelSearchResult[]) => {
    options.value = results;
  });
  chatSocket.emit("searchChannels", search.value);
});
</script>

<template>
  <dialog v-if="isOpen" class="modal modal-open" @click.prevent="$emit('closeModal')">
    <div class="modal-box absolute top-20" @click.prevent.stop="">
      <h3 class="font-bold text-xl mb-2">Search</h3>
      <input
        type="text"
        class="input input-primary w-full mb-2"
        placeholder="Search chat"
        v-model="search"
        @keydown.prevent.exact.esc="handleEsc"
      />
      <div class="overflow-y-auto max-h-96 grid items-center" :class="!options.length && 'h-48'">
        <ul v-if="options.length" class="w-full" @click.prevent.stop="handleClick">
          <li
            v-for="option in options"
            class="p-4 border border-base-300 mt-2"
            :class="selectedOption === option && 'bg-base-200 bg-opacity-20 cursor-pointer'"
            @mouseover="selectedOption = option"
            @mouseleave="selectedOption = null"
          >
            <div class="flex gap-4 items-center">
              <div class="avatar w-16">
                <div class="rounded-full bg-base-200">
                  <img :src="option.imageUrl || `https://robohash.org/${option.name}.png`" :alt="`channel image`" />
                </div>
              </div>
              <div>
                <div class="text-xl text-base-content">{{ option.name }}</div>
                <ul class="flex gap-2">
                  <li v-for="tag in option.tags" :key="tag" class="badge badge-primary">{{ tag }}</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <span v-else class="text-xl text-neutral font-bold mx-auto text-center"> Not found </span>
      </div>
    </div>
  </dialog>
</template>
