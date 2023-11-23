import "./icons";
import App from "./App.vue";
import createRouter from "./router";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { OhVueIcon } from "oh-vue-icons";

import Typography from "./components/Typography.vue";
import Picture from "./components/Picture.vue";

createApp(App)
  .component("Typography", Typography)
  .component("Picture", Picture)
  .component("Icon", OhVueIcon)
  .use(createPinia())
  .use(createRouter())
  .mount("#app");
