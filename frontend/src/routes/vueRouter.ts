import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const childrenLobby = [
  {
    path: "game",
    name: "game",
    component: () => import("../views/GameView.vue"),
  },
  {
    path: "profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "users",
    name: "users",
    component: () => import("../views/UsersView.vue"),
  },
];

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("../views/NotFoundView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/",
    name: "lobby",
    component: () => import("../views/LobbyView.vue"),
    redirect: { name: "profile" },
    children: childrenLobby,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const useStore = useUserStore();
  const hasCookie = document.cookie.includes("connect.flag");

  hasCookie && (await useStore.setMe());

  if (to.name !== "login" && !useStore.isAuthenticated) next({ name: "login" });
  if (to.name === "login" && useStore.isAuthenticated && hasCookie)
    next({ name: "lobby" });
  else next();
});

export { router, routes };
