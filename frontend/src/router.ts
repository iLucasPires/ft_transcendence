import { createRouter, createWebHistory } from "vue-router";

import LoginView from "./views/LoginView.vue";
import LobbyView from "./views/LobbyView.vue";
import AboutView from "./views/AboutView.vue";
import GameViewVue from "./views/GameView.vue";
import ProfileViewVue from "./views/ProfileView.vue";
import NotFoundView from "./views/NotFoundView.vue";

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: NotFoundView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/",
    name: "lobby",
    component: LobbyView,
    redirect: { name: "profile" },
    children: [
      {
        path: "game",
        name: "game",
        component: GameViewVue,
      },
      {
        path: "profile",
        name: "profile",
        component: ProfileViewVue,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // We check if a flag cookie is set, if not we redirect to the login page
  const isCookieSet = document.cookie.indexOf("connect.flag=") !== -1;

  if (!isCookieSet && to.name !== "login") {
    return next({ name: "login" });
  }

  next();
});

export { router, routes };
