import Cookies from "js-cookie";
import { defineStore } from "pinia";

import { api } from "@/routes/apiRouter";
import { router } from "@/routes/vueRouter";
import type { iUser } from "@/types/props.js";

function handleInvalidCookie() {
  router.push({ name: "login" });
  Cookies.remove("connect.sid");
  Cookies.remove("connect.flag");
  localStorage.removeItem("user");
}

async function handleResSaveStorage(res: Response, key: string = "user") {
  const data = await res.json();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

function newFormData(file: File | null, key: string = "file") {
  const formData = new FormData();
  if (file) formData.append(key, file);
  return formData;
}

export const useUserStore = defineStore("userStore", {
  state: function () {
    const localUser = localStorage.getItem("user");

    return {
      status: { isGame: false, isOnline: false },
      meData: localUser ? (JSON.parse(localUser) as iUser) : null,
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
      this.meData = null;
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

    async change2FA(totp: string, type2fa: boolean) {
      const res = type2fa
        ? await api.enable2fa(totp)
        : await api.disable2fa(totp);

      if (res.ok && this.meData !== null)
        this.meData.isTwoFactorAuthEnabled = type2fa;
    },

    changeStatusGame() {
      this.status.isGame = !this.status.isGame;
    },

    changeStatusOnline() {
      this.status.isOnline = !this.status.isOnline;
    },

    async verify2FA(totp: string) {
      const res = await api.verify2fa(totp);
      if (res.ok) router.push({ name: "lobby" });
    },
  },
  getters: {
    isAuthenticated: (state) => state.meData !== null,
    is2FA: (state) => state.meData?.isTwoFactorAuthEnabled,
  },
});
