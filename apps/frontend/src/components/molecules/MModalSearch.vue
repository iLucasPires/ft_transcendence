<script setup lang="ts">
import { chatSocket } from "@/socket";
import type { iChannelSearchResult, iCurrentChannel } from "@/types/props";

const chatStore = useChatStore();
const appStore = useAppStore();
const search = ref<string>("");
const options = ref<iChannelSearchResult[]>([]);
const selectedOption = ref<iChannelSearchResult | null>(null);
const channelPendingPassword = ref<iChannelSearchResult | null>(null);
const privateChannelPassword = ref<string>("");
const { modalSearch } = storeToRefs(appStore);

const useDebounce = () => {
  let timeout: NodeJS.Timeout | null = null;
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
  appStore.changeModalSearch();
};

const handleClick = () => {
  const channel = selectedOption.value;
  search.value = "";
  selectedOption.value = null;

  if (channel === null) {
    return;
  }

  const isDm = channel.type === "dm";
  if (isDm) {
    chatSocket.emit("enterDmChat", channel.name, (channel: iCurrentChannel) => {
      chatStore.currentChat = channel;
      chatSocket.emit("fetchChannels");
    });
    appStore.changeModalSearch();
    return;
  }
  const isMember = !isDm && channel.tags.includes("member");
  if (isMember) {
    chatSocket.emit("enterGroupChat", channel.id, (channel: iCurrentChannel) => {
      chatStore.currentChat = channel;
      chatSocket.emit("fetchChannels");
    });
    appStore.changeModalSearch();
    return;
  }
  const isPrivate = channel.tags.includes("private");
  if (isPrivate) {
    channelPendingPassword.value = channel;
    return;
  }
  chatSocket.emit("joinGroupChat", { channelId: channel.id }, (channel: iCurrentChannel) => {
    chatStore.currentChat = channel;
    chatSocket.emit("fetchChannels");
  });
  appStore.changeModalSearch();
};

const handlePasswordInput = () => {
  const channel = channelPendingPassword.value;
  if (channel === null) {
    return;
  }
  chatSocket.emit(
    "joinGroupChat",
    { channelId: channel.id, password: privateChannelPassword.value },
    (channel: iCurrentChannel) => {
      chatStore.currentChat = channel;
      chatSocket.emit("fetchChannels");
      appStore.changeModalSearch();
      channelPendingPassword.value = null;
    },
  );
  privateChannelPassword.value = "";
};

const chatImage = (option: iChannelSearchResult) => {
  if (option.type === "dm") {
    return option.imageUrl || `https://robohash.org/${option.name}.png`;
  }
  return "/group.png";
};

watch(search, () => debounce(() => chatSocket.emit("searchChannels", search.value), 300));
watch(modalSearch, (value) => {
  if (value) {
    chatSocket.emit("searchChannels", search.value);
    return;
  }
  search.value = "";
  channelPendingPassword.value = null;
  privateChannelPassword.value = "";
});
onMounted(() => {
  chatSocket.on("searchResults", (results: iChannelSearchResult[]) => (options.value = results));
});
</script>

<template>
  <dialog v-if="appStore.modalSearch" class="modal modal-open" @click.prevent="appStore.changeModalSearch()">
    <div class="modal-box absolute top-20" @click.prevent.stop="">
      <template v-if="!!channelPendingPassword">
        <h3 class="font-bold text-xl mb-2">Join {{ channelPendingPassword.name }}</h3>
        <input
          type="password"
          class="input input-primary w-full mb-2"
          placeholder="Password"
          v-model="privateChannelPassword"
          @keydown.prevent.exact.enter="handlePasswordInput"
        />
        <AButton class="btn-primary w-full" text="Join channel" @click="handlePasswordInput" />
      </template>
      <template v-else>
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
              class="p-4 border border-base-300 rounded mt-2 hover:border-primary"
              :class="selectedOption === option && 'bg-base-200 bg-opacity-20 cursor-pointer'"
              @mouseover="selectedOption = option"
              @mouseleave="selectedOption = null"
            >
              <div class="flex gap-4 items-center">
                <AChatImage :image-url="chatImage(option)" />
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
      </template>
    </div>
  </dialog>
</template>
