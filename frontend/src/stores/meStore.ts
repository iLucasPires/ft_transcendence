import { defineStore } from "pinia";
import { api, utils } from "@/routes/apiRouter";
import type { iUser } from "@/types/props.js";

export const useMeStore = defineStore("meStore", {
  state: function () {
    return {
      data: null as iUser | null,
      status: { isGame: false, isOnline: false },
    };
  },

  actions: {
    async setMe() {
      const res = await api.getMeData();

      if (res.ok) {
        this.data = await res.json();
        return "Success: Get me!";
      }

      return "Failed: Unknown error!";
    },

    async unsetMe() {
      utils.clearCookies();
      if (this.data) {
        this.data = null;
        this.status.isGame = false;
        this.status.isOnline = false;
      }
      return "Success: Logout!";
    },

    async changeCompleteRegistration() {
      const res = await api.updateUsernameMe(this.data?.username as string);

      if (res.ok && this.data) {
        this.data.registrationComplete = true;
        return "Success: Registration complete!";
      }

      return "Failed: Registration failed!";
    },

    async changeUsername(nickname: string) {
      if (!nickname || nickname === this.data?.username) {
        return "Failed: Username is the same! or empty";
      }

      const res = await api.updateUsernameMe(nickname);

      if (res.ok && this.data) {
        this.data.username = nickname;
        this.data.registrationComplete = true;

        return "Success: Username changed!";
      }
      return `Failed: ${await utils.handleMessage(res)}`;
    },

    async changeAvatar(file: File | null) {
      if (!file) return "Failed: File is empty!";

      const res = await api.updateAvatarMe(file);

      if (res.ok && this.data) {
        this.data = await res.json();
        return "Success: Avatar changed!";
      }

      return `Failed: ${await utils.handleMessage(res)}`;
    },

    async change2FA(totp: string, type2fa: boolean) {
      const res = type2fa
        ? await api.enable2fa(totp)
        : await api.disable2fa(totp);

      if (res.ok && this.data) {
        this.data.isTwoFactorAuthEnabled = type2fa;
        return `Success: ${(type2fa ? "Enable" : "Disable") + " 2FA Success!"}`;
      }

      return `Failed: ${await utils.handleMessage(res)}`;
    },

    changeStatusGame() {
      this.status.isGame = !this.status.isGame;
    },

    changeStatusOnline() {
      this.status.isOnline = !this.status.isOnline;
    },

    async verify2FA(totp: string) {
      const res = await api.verify2fa(totp);

      if (res.ok && this.data) {
        this.data.isTwoFactorAuthApproved = true;
        return "Success: 2FA verified!";
      }

      return `Failed: ${await utils.handleMessage(res)}`;
    },
  },
  getters: {
    isComplete: (state) => state.data?.registrationComplete === true,
    isAuthenticated: (state) => state.data !== null,
    is2FA: (state) => state.data?.isTwoFactorAuthEnabled,
    isApproved: (state) => state.data?.isTwoFactorAuthApproved,
  },
});
