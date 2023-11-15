import App from "./App.vue";
import router from "./router";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import * as AllIcons from "./icons";

addIcons(...Object.values({ ...AllIcons }));

createApp(App)
  .use(createPinia())
  .use(router)
  .component("v-icon", OhVueIcon)
  .mount("#app");
