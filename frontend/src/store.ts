import { defineStore } from "pinia";
import { THEMES, DOMHtml } from "./design/theme";
import type { iUser, iAchievement } from "@/types/props.js";
import type PFive from "p5";

export default defineStore("store", {
  state: function () {
    const achievementData: Array<iAchievement> = [];
    const useData: iUser = JSON.parse(localStorage.getItem("user") || "null");
    const themeData = localStorage.getItem("theme") as string;

    return {
      useData: useData,
      themeData: themeData,
      achievementData: achievementData,
      gameData: null as PFive | null,
      status: {
        isGame: false,
        isOnline: false,
      },
    };
  },

  actions: {
    async getUseData() {
      async function fetchUser(): Promise<iUser> {
        const res = await fetch("https://randomuser.me/api/");
        return await res.json();
      }

      if (!this.useData != null) {
        this.useData = await fetchUser();
        localStorage.setItem("use", JSON.stringify(this.useData));
      }
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
    isThemeDark: (state) => state.themeData === THEMES[0],
  },
});
