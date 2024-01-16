import { createRouter, createWebHistory } from "vue-router";
import { useMeStore } from "@/stores/meStore";
import { useAppStore } from "@/stores/appStore";

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
  const meStore = useMeStore();
  const appStore = useAppStore();
  const session = document.cookie.includes("connect.flag");
  
  if (!session && to.name !== "login"){
    appStore.changeMessageLog("Warning: You are not logged in!");
    return next({ name: "login" });
  } 

  
  else if (session) {
    if (!meStore.data) {
      const message = await meStore.setMe();
      appStore.changeMessageLog(message);
    } 
    if (!meStore.is2FA && to.name === "2fa") return next({ name: "lobby" });

    if (meStore.is2FA) {
      if (meStore.isApproved && to.name === "2fa") return next({ name: "lobby" });
      if (!meStore.isApproved && to.name !== "2fa") return next({ name: "2fa" });
    }
  }
  


  return next();
});

export default router;
