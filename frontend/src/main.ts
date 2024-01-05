import "@/icons";
import "@/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { OhVueIcon } from "oh-vue-icons";
import { router } from "@/routes/vueRouter";
import App from "@/App.vue";

createApp(App)
  .provide("backendUrl", import.meta.env.VITE_BACKEND_URL)
  .provide("frontendUrl", import.meta.env.FRONTEND_URL)
  .component("Icon", OhVueIcon)
  .use(createPinia())
  .use(router)
  .mount("#app");
