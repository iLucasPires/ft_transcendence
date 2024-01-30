import "@/icons";
import "@/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { OhVueIcon } from "oh-vue-icons";

import router from "@/routes/vueRouter";
import App from "@/App.vue";

createApp(App).component("Icon", OhVueIcon).use(createPinia()).use(router).mount("#app");
