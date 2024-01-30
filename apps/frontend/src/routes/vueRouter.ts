import { createRouter, createWebHistory } from "vue-router";
import { useMeStore } from "@/stores/meStore";
import { useAppStore } from "@/stores/appStore";

import GameView from "@/pages/Lobby/GameView.vue";
import ProfileView from "@/pages/Lobby/ProfileView.vue";
import UsersView from "@/pages/Lobby/UsersView.vue";
import EditView from "@/pages/Lobby/EditView.vue";
import ChatView from "@/pages/Lobby/ChatView.vue";

const routes = [
  { path: "/2fa", name: "2fa", component: () => import("@/pages/TwoFAView.vue") },
  { path: "/login", name: "login", component: () => import("@/pages/LoginView.vue") },
  { path: "/:catchAll(.*)", name: "not-found", component: () => import("@/pages/NotFoundView.vue") },
  {
    path: "/",
    name: "lobby",
    redirect: { name: "profile" },
    component: () => import("@/pages/Lobby/LobbyView.vue"),
    children: [
      { path: "game", name: "game", component: GameView },
      { path: "profile", name: "profile", component: ProfileView },
      { path: "users", name: "users", component: UsersView },
      { path: "/profile/edit", name: "edit-profile", component: EditView },
      { path: "/chat", name: "chat", component: ChatView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to, from, next) => {
  const meStore = useMeStore();
  const appStore = useAppStore();
  const session = document.cookie.includes("connect.flag");

  if (!session && to.name !== "login") {
    appStore.changeMessageLog(await meStore.unsetMe());
    appStore.changeMessageLog("Warning: You are not logged in!");

    return next({ name: "login" });
  }
  if (session) {
    if (!meStore.data) appStore.changeMessageLog(await meStore.setMe());
    if (!meStore.is2FA && to.name === "2fa") return next({ name: "lobby" });

    if (meStore.is2FA) {
      if (meStore.isApproved && to.name === "2fa") return next({ name: "lobby" });
      if (!meStore.isApproved && to.name !== "2fa") return next({ name: "2fa" });
    }
  }

  return next();
});

export default router;
