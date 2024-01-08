<script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const photoProfile = computed(() => {
  return (
    userStore.meData?.avatarUrl ||
    `https://robohash.org/${userStore.meData?.username}.png`
  );
});

const infos = computed(() => {
  return [
    { name: "Wins", value: 10 },
    { name: "Losses", value: 10 },
    { name: "Status", value: "Online" },
    {
      name: "2FA",
      value: userStore.meData?.isTwoFactorAuthEnabled ? "Enabled" : "Disabled",
    },
  ];
});
</script>

<template>
  <main class="full card-padding">
    <div class="full column separate md:border-card">
      <div class="column separate rounded relative border-card">
        <button
          class="btn btn-primary btn-sm absolute top-4 right-4"
          v-on:click="$router.push({ name: 'edit-profile' })"
        >
          <Icon name="md-modeedit" />
        </button>
        <div class="flex items-end gap-2">
          <img
            class="img-avatar"
            v-bind:alt="'profile picture'"
            v-bind:src="photoProfile"
          />
          <h2 class="title" v-text="userStore.meData?.username" />
        </div>
        <ul class="wrap gap-2">
          <button
            v-for="item in infos"
            v-bind:key="item.name"
            className="btn btn-sm"
          >
            {{ item.name }}
            <div className="badge badge-primary">{{ item.value }}</div>
          </button>
        </ul>
      </div>

      <div
        class="column h-full separate rounded relative items-center md:flex-row border-card"
      ></div>
    </div>
  </main>
</template>
