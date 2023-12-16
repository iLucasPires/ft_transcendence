import { defineStore } from "pinia";
import type { iUser } from "@/types/props.js";

import api from "@/routes/apiRouter";
import { useAppStore } from "./appStore";

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

      if (res?.ok) this.meData = await api.handleResponseToJson(res);
      if (res?.status === 401 || res?.status === 403) {
        const uiStore = useAppStore();

        await api.logout();
        api.handleInvalidCookie();
        uiStore.changeStatusErro(res.statusText);
      }
    },

    async unsetMe() {
      const uiStore = useAppStore();

      const res = await api.logout();
      api.handleInvalidCookie();
      this.meData = JSON.parse("null");
      uiStore.changeStatusErro("Success logout user");
    },

    async changeMe(username: string, file: File | null) {
      const uiStore = useAppStore();

      if (username.match(/^[a-zA-Z0-9]+$/)) {
        const res = await api.updateUsernameMe(username);

        if (res?.ok) this.meData = await api.handleResponseToJson(res);
        else
          uiStore.changeStatusErro(res.statusText || "Error update username");
      }

      if (file !== null) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.updateAvatarMe(formData);
        if (res?.ok) this.meData = await api.handleResponseToJson(res);
        else uiStore.changeStatusErro(res.statusText || "Error update avatar");
      }
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
  },
});
