import { defineStore } from "pinia";
import { THEMES, DOMHtml } from "./design/theme";
import type { iUser, iAchievement } from "@/types/props.js";
import type PFive from "p5";
import { router } from "./router";

export default defineStore("store", {
  state: function () {
    const useData = null as iUser | null ;
    const achievementData: Array<iAchievement> = [];
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
      async function fetchUser(): Promise<Response> {
        const res = await fetch("http://localhost:3000/api/me", {
          method: "GET",
          credentials: "include",
        });
        return res;
      }
      const response: Response = await fetchUser();

      if (response.status === 403) {
        router.push("/login");
      } else {
        this.useData = await response.json();
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
