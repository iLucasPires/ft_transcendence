import { defineStore } from "pinia";
import { api, utils } from "@/routes/apiRouter";
import { useAppStore } from "./appStore";
import type { iUser } from "@/types/props.js";

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
      const appStore = useAppStore();
      const res = await api.getMeData();

      if (res.ok) {
        this.meData = await utils.handleResSaveStorage(res);
        appStore.changeMessageLog("Login success!");
        return true;
      }

      appStore.changeMessageLog("Login failed!");
      return false;
    },

    async unsetMe() {
      const appStore = useAppStore();

      await api.logout();
      this.meData = null;
      appStore.changeMessageLog("Logout success!");
      return true;
    },

    async changeUsername(nickname: string) {
      const appStore = useAppStore();

      if (!nickname) return false;
      if (nickname === this.meData?.username) {
        appStore.changeMessageLog("nickname is empty or equal");
        return false;
      }

      const res = await api.updateUsernameMe(nickname);

      if (res.ok && this.meData) {
        this.meData.username = nickname;
        appStore.changeMessageLog("Username changed!");
        return true;
      }

      appStore.changeMessageLog(await utils.handleMessage(res));
      return false;
    },

    async changeAvatar(file: File | null) {
      if (!file) return false;

      const appStore = useAppStore();
      const res = await api.updateAvatarMe(file);

      if (res.ok && this.meData) {
        this.meData = await utils.handleResSaveStorage(res);
        appStore.changeMessageLog("Avatar changed!");
        return true;
      }

      appStore.changeMessageLog(await utils.handleMessage(res));
      return false;
    },

    async change2FA(totp: string, type2fa: boolean) {
      const appStore = useAppStore();
      const res = type2fa
        ? await api.enable2fa(totp)
        : await api.disable2fa(totp);

      if (res.ok && this.meData !== null) {
        this.meData.isTwoFactorAuthEnabled = type2fa;
        return true;
      }

      appStore.changeMessageLog(await utils.handleMessage(res));
      return false;
    },

    changeStatusGame() {
      this.status.isGame = !this.status.isGame;
    },

    changeStatusOnline() {
      this.status.isOnline = !this.status.isOnline;
    },

    async verify2FA(totp: string) {
      const res = await api.verify2fa(totp);
    },
  },
  getters: {
    isAuthenticated: (state) => state.meData !== null,
    is2FA: (state) => state.meData?.isTwoFactorAuthEnabled,
  },
});
