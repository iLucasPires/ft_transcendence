import { defineStore } from "pinia";

import api from "./api";
import { THEMES, DOMHtml, initThemeData } from "./design/theme";

import type { iUser } from "@/types/props.js";
import type PFive from "p5";

export default defineStore("store", {
  state: function () {
    const useData: iUser = JSON.parse(localStorage.getItem("user") || "null");
    const themeData = localStorage.getItem("theme") as string;

    return {
      useData: useData,
      themeData: themeData,
      gameData: null as PFive | null,
      erroData: null as string | null,
      modal: null as HTMLDialogElement | null,
      status: {
        isGame: false,
        isOnline: false,
      },
    };
  },

  actions: {
    async setMe() {
      const useData = await api.getMe();
      if (useData !== null) {
        this.useData = useData;
        this.useData.avatarUrl = api.getAvatarMe(useData.avatarUrl);
        localStorage.setItem("user", JSON.stringify(this.useData));
      }
    },

    setTheme() {
      initThemeData();
    },

    setModal() {
      this.modal = document.querySelector("#modalUpdate");
    },

    async changeMe(newUsername: string, file: File | null) {
      if (newUsername.length > 2 && newUsername.length < 20) {
        const usernameResponse = await api.updateUsernameMe(newUsername);
        if (usernameResponse !== null) {
          this.useData = usernameResponse;
        }
      }

      if (file !== null) {
        const avatarResponse = await api.updateAvatarMe(file);
        if (avatarResponse !== null) {
          this.useData = avatarResponse;
        }
      }

      this.useData.avatarUrl = api.getAvatarMe(this.useData.avatarUrl);
      localStorage.setItem("user", JSON.stringify(this.useData));
    },
    async changeUsername(newUsername: string) {
      const response = await api.updateUsernameMe(newUsername);
      if (response !== null) {
        this.useData = response;
        localStorage.setItem("user", JSON.stringify(this.useData));
      }
    },

    async changeAvatar(file: File) {
      const response = await api.updateAvatarMe(file);
      if (response !== null) {
        const useData = response;
        this.useData.avatarUrl = api.getAvatarMe(useData.avatarUrl);
        localStorage.setItem("user", JSON.stringify(this.useData));
      }
    },

    changeStatusErro(erro: string) {
      this.erroData = erro;
    },

    changeStatusGame() {
      this.status.isGame = !this.status.isGame;
    },

    changeStatusOnline() {
      this.status.isOnline = !this.status.isOnline;
    },

    changeTheme() {
      this.themeData = THEMES[+!THEMES.indexOf(this.themeData)];
      DOMHtml?.setAttribute("data-theme", this.themeData);
      localStorage.setItem("theme", this.themeData);
    },

    openModal() {
      this.modal?.showModal();
    },

    closeModal() {
      this.modal?.close();
    },
  },

  getters: {
    hasUserData: (state) => state.useData !== null,
    isThemeDark: (state) => state.themeData === THEMES[0],
    isCompleteRegistration: (state) => {
      console.log(state.useData);
      return (
        state.useData !== null && state.useData.registrationComplete === true
      );
    },
  },
});
