<template>
  <div
    class="flex items-center md:w-2/5 border-2 border-neutral h-full w-full p-10 rounded"
  >
    <img
      class="mask mask-circle w-1/3 mr-5"
      src="https://via.placeholder.com/250"
      alt="profile"
    />
    <div class="flex flex-col">
      <div>
        <h1 class="text-2xl font-bold text-slate-200">Marcelo lindão</h1>
        <p class="text-slate-199 italic">Level 1</p>
      </div>
      <div class="flex flex-wrap gap-5 ">
        <div class="tooltip flex gap-2" data-tip="Vitórias">
          <v-icon name="ri-ping-pong-fill" class="text-3xl text-green-400" />
          <p class="text-slate-200">232</p>
        </div>
        <div class="tooltip flex gap-2" data-tip="Derrotas">
          <v-icon name="ri-ping-pong-fill" class="text-3xl text-red-400" />
          <p class="text-slate-200">232</p>
        </div>
      </div>
    </div>
  </div>
</template>
