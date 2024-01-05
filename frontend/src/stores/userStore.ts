import { defineStore } from "pinia";
import Cookies from "js-cookie";

import { router } from "@/routes/vueRouter";
import { api } from "@/routes/apiRouter";
import type { iUser } from "@/types/props.js";

function handleInvalidCookie() {
  Cookies.remove("connect.sid");
  Cookies.remove("connect.flag");
  localStorage.removeItem("user");
  router.push({ name: "login" });
}

async function handleResSaveStorage(res: Response, key: string = "user") {
  const data = await res.json();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

function newFormData(file: File | null) {
  const formData = new FormData();
  if (file) formData.append("file", file);
  return formData;
}

export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      status: { isGame: false, isOnline: false },
      meData: JSON.parse(localStorage.getItem("user") || "null") as iUser,
    };
  },

  actions: {
    async setMe() {
      const res = await api.getMeData();

      if (res.ok) this.meData = await handleResSaveStorage(res);
      else if (res.status === 401 || res.status === 403) {
        await api.logout();
        handleInvalidCookie();
      }
    },

    async unsetMe() {
      this.meData = JSON.parse("null");
      handleInvalidCookie();
    },

    async changeUsername(nickname: string) {
      const res = await api.updateUsernameMe(nickname);
      if (res.ok) this.meData = await handleResSaveStorage(res);
    },

    async changeAvatar(file: File | null) {
      if (file) {
        const res = await api.updateAvatarMe(newFormData(file));
        if (res.ok) this.meData = await handleResSaveStorage(res);
      }
    },

    async changeMe(username: string, file: File | null) {
      await this.changeUsername(username);
      await this.changeAvatar(file);
    },

    async change2FA(totp: string, type: boolean) {
      const res = type ? await api.enable2fa(totp) : await api.disable2fa(totp);
      if (res.ok) this.meData.isTwoFactorAuthEnabled = type;
    },

    changeStatusGame() {
      this.status.isGame = !this.status.isGame;
    },

    changeStatusOnline() {
      this.status.isOnline = !this.status.isOnline;
    },
  },
  getters: {
    isAuthenticated: (state) => state.meData !== null,
    is2FA: (state) => state.meData.isTwoFactorAuthEnabled,
  },
});
