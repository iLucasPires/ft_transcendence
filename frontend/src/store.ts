import { defineStore } from "pinia";
import { THEMES, DOMHtml } from "./design/theme";
import type { iUser } from "@/types/props.js";
import type PFive from "p5";
import api from "./api";

export default defineStore("store", {
  state: function () {
    const useData: iUser = JSON.parse(localStorage.getItem("user") || "null");
    const themeData = localStorage.getItem("theme") as string;

    return {
      useData: useData,
      themeData: themeData,
      gameData: null as PFive | null,
      status: {
        isGame: false,
        isOnline: false,
      },
    };
  },

  actions: {
    async setMe() {
      this.useData = await api.getMe();
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
