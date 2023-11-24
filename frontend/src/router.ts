import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./views/LoginView.vue";
import LobbyView from "./views/LobbyView.vue";
import AboutView from "./views/AboutView.vue";

import GameViewVue from "./views/GameView.vue";
import ProfileViewVue from "./views/ProfileView.vue";

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("./views/NotFoundView.vue"),
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
]


export default function () {
  const router = createRouter({history: createWebHistory(import.meta.env.BASE_URL), routes });

  router.beforeEach((to, _, next) => {
    if (!document.cookie.includes("session=") && to.name !== "login") {
      return next({ name: "login" });
    }
    next();
  });

  return (router);
}  
