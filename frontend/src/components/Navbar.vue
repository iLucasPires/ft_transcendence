<script setup lang="ts">
import { RouterLink } from "vue-router";
import Typography from "./Typography.vue";
</script>

<template>
  <aside class="h-full w-96 p-5 z-10 flex flex-col bg-primary">
    <div class="flex flex-row justify-between items-center gap-2 w-full">
      <RouterLink to="/lobby">
        <Typography class="uppercase" :level="1" size="2xl"
          >Transcendence</Typography
        >
      </RouterLink>
      <Icon scale="1.5" name="md-keyboarddoublearrowleft" />
    </div>
    <nav class="flex flex-col flex-1 justify-between mt-10">
      <ul class>
        <li>
          <RouterLink
            to="/lobby/game"
            class="btn btn-ghost w-full justify-start"
          >
            <Icon scale="1" name="io-game-controller" />
            <Typography class="uppercase" :level="2">Game</Typography>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/lobby/game"
            class="btn btn-ghost w-full justify-start"
          >
            <Icon scale="1" name="io-chatbubbles-sharp" />
            <Typography class="uppercase" :level="2">Chat</Typography>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/lobby/game"
            class="btn btn-ghost w-full justify-start"
          >
            <Icon scale="1" name="md-workhistory-round" />
            <Typography class="uppercase" :level="2">History</Typography>
          </RouterLink>
        </li>
      </ul>

      <button class="btn btn-ghost w-full justify-start">
        <Icon scale="1" name="md-logout" />
        <Typography class="uppercase" :level="2"
          >Logout</Typography
        >
      </button>
    </nav>
  </aside>
</template>
