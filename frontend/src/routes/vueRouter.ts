import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const childrenLobby = [
  {
    path: "game",
    name: "game",
    component: () => import("@/components/pages/GameView.vue"),
  },
  {
    path: "profile",
    name: "profile",
    component: () => import("@/components/pages/ProfileView.vue"),
  },
  {
    path: "users",
    name: "users",
    component: () => import("@/components/pages/UsersView.vue"),
  },
];

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("@/components/pages/NotFoundView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/components/pages/LoginView.vue"),
  },
  {
    path: "/",
    name: "lobby",
    component: () => import("@/components/pages/LobbyView.vue"),
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
