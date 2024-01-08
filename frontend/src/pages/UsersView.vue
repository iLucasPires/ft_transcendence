<script setup lang="ts">
import { ref, onMounted } from "vue";

import { api } from "@/routes/apiRouter";
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import type { iUser } from "@/types/props";

const appStore = useAppStore();
const userStore = useUserStore();

const users = ref([] as iUser[]);
const tabs = ["all", "friends", "blocked"];

async function fetchUsers(tab: string) {
  const apiMethod = {
    all: api.getAllUsers,
    blocked: api.getAllBlockedUsers,
    friends: api.getAllFriends,
  }[tab];

  const res = apiMethod ? await apiMethod() : await api.getAllUsers();
  const users = (await res.json()) as iUser[];
  return users.sort((a, b) => a.email.localeCompare(b.email));
}

async function handleClickBlock(username: string) {
  const res =
    appStore.tab === "blocked"
      ? await api.unblockUser(username)
      : await api.blockUser(username);

  const message = appStore.tab === "blocked" ? "Unblocked" : "Blocked";

  if (res?.ok) {
    users.value = users.value.filter((user) => user.username !== username);
    appStore.changeMessageLog(`Successfully ${message} ${username}`);
  } else appStore.changeMessageLog(`Failed to ${message} ${username}`);
}

async function handleClickAddFriend(username: string) {
  const message = appStore.tab === "friends" ? "Unfriended" : "Added";

  const res =
    appStore.tab === "friends"
      ? await api.unfriend(username)
      : await api.addFriend(username);

  if (appStore.tab === "friends")
    users.value = users.value.filter((user) => user.username !== username);

  if (res?.ok) {
    appStore.changeMessageLog(`Successfully ${message} ${username}`);
  } else {
    appStore.changeMessageLog(
      `Failed to ${message} ${username}, maybe you are already friends?`
    );
  }
}

async function handleChangeTab(tab: string) {
  users.value = await fetchUsers(tab);
  appStore.changetab(tab);
}

onMounted(async () => {
  await handleChangeTab("all");
});
</script>

<template>
  <div class="full card-padding">
    <div class="md:border-card column h-full separate">
      <div class="flex gap-1" data-tabs="tabs" role="tablist">
        <button
          value="tab"
          class="btn-tab"
          v-for="tab in tabs"
          v-bind:aria-selected="appStore.tab === tab"
          v-on:click="handleChangeTab(tab)"
          v-text="tab"
        />
      </div>
      <ul class="overflow-y-auto grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <li
          class="column separate items-center border-card"
          v-for="user in users"
          v-bind:key="user.id"
        >
          <img
            class="img-avatar"
            v-bind:src="
              user.avatarUrl || `https://robohash.org/${user.username}.png`
            "
            v-bind:alt="user.username"
          />
          <h2 class="title" v-text="user.username" />

          <ul class="flex w-full mt-4 gap-2">
            <button
              class="btn-full btn-primary"
              v-on:click="$router.push('/profile')"
              v-if="userStore.meData?.username === user.username"
              v-text="'See your profile'"
            />

            <template v-else>
              <button
                class="btn-full btn-primary"
                v-if="appStore.tab !== 'blocked'"
                v-on:click="handleClickAddFriend(user.username)"
                v-text="appStore.tab === 'friends' ? 'Unfriend' : 'Add friend'"
              />
              <button
                class="btn-full btn-secondary"
                v-on:click="handleClickBlock(user.username)"
                v-text="appStore.tab === 'blocked' ? 'Unblock' : 'Block'"
              />
            </template>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
