<template>
  <RouterView />
</template>

<style>
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

*::-webkit-scrollbar {
  width: 15px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  background: var(--primary);
  border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--secondary);
  border-radius: 14px;
  border: 3px solid var(--primary);
}
</style>
