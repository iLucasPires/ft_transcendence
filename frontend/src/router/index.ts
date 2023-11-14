import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LobbyView from "../views/LobbyView.vue";
import AboutView from "../views/AboutView.vue";

import GameViewVue from "../views/lobby/GameView.vue";
import ProfileViewVue from "../views/lobby/ProfileView.vue";

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/lobby",
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
        }
      ],
    },
  ],
});
