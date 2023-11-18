import "./icons";
import App from "./App.vue";
import createRouter from "./router";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { OhVueIcon } from "oh-vue-icons";

createApp(App)
  .use(createPinia())
  .use(createRouter())
  .component("v-icon", OhVueIcon)
  .mount("#app");
