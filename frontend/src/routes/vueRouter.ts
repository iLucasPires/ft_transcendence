import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const childrenLobby = [
  {
    path: "game",
    name: "game",
    component: () => import("@/pages/Lobby/GameView.vue"),
  },
  {
    path: "profile",
    name: "profile",
    component: () => import("@/pages/Lobby/ProfileView.vue"),
  },
  {
    path: "users",
    name: "users",
    component: () => import("@/pages/Lobby/UsersView.vue"),
  },
  {
    path: "/profile/edit",
    name: "edit-profile",
    component: () => import("@/pages/Lobby/EditView.vue"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("@/pages/Lobby/ChatView.vue"),
  },
];

const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("@/pages/NotFoundView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/LoginView.vue"),
  },
  {
    path: "/",
    name: "lobby",
    component: () => import("@/pages/Lobby/LobbyView.vue"),
    redirect: { name: "profile" },
    children: childrenLobby,
  },
  {
    path: "/2fa",
    name: "2fa",
    component: () => import("@/pages/TwoFAView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const useStore = useUserStore();
  const hasCookie = document.cookie.includes("connect.flag");

  if (hasCookie) {
    if (!useStore.meData) {
      return (await useStore.setMe())
        ? next({ name: "lobby" })
        : next({ name: "login" });
    }
  }

  if (!useStore.isAuthenticated) {
    if (to.name !== "login") {
      return next({ name: "login" });
    }
    return next();
  }
  if (!hasCookie) {
    await useStore.unsetMe();
    return next({ name: "login" });
  }

  // NOTE: From here the user is authenticated. - ok
  if (to.name === "login") {
    return next({ name: "lobby" });
  }

  if (
    useStore.meData &&
    useStore.meData.isTwoFactorAuthEnabled &&
    !useStore.meData.isTwoFactorAuthApproved &&
    to.name !== "2fa"
  ) {
    return next({ name: "2fa" });
  }

  if (
    to.name === "2fa" &&
    useStore.meData &&
    !!useStore.meData.isTwoFactorAuthApproved
  ) {
    return next({ name: "lobby" });
  }

  return next();
});

export { router, routes };
