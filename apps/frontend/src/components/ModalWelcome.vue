<script setup lang="ts">
const appStore = useAppStore();
const meStore = useMeStore();
</script>

<template>
  <dialog class="modal modal-open" v-if="meStore.data && !meStore.isComplete && $route.name !== 'edit-profile'">
    <div class="modal-box column items-center">
      <h3 class="font-bold text-lg">Welcome to Transcendence</h3>
      <div class="py-4">
        <p>
          To unlock all game features, ensure you complete your profile by either editing it with your information or
          using the default values.
        </p>
      </div>
      <div class="w-full flex gap-1">
        <button
          class="btn-full btn-primary"
          v-on:click="$router.push({ name: 'edit-profile' })"
          v-text="'Edit profile'"
        />
        <button
          class="btn-full btn-secondary"
          v-on:click="
            meStore.changeCompleteRegistration().then((log) => {
              appStore.changeMessageLog(log);
            })
          "
          v-text="'Use default'"
        />
      </div>
    </div>
  </dialog>
</template>
