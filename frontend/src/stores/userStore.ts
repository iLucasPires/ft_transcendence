import { defineStore } from "pinia";
import { type iUser, type iAchievement } from "@/types/props.js";
import router from "@/router"; // Import your router instance

export default defineStore("use", {
  state: () => {
    return {
      useData: JSON.parse(
        localStorage.getItem("user") || "null"
      ) as iUser | null,
      achievementData: null as iAchievement | null,
    };
  },

  actions: {
    async login(): Promise<void> {
      async function fetchUser(): Promise<iUser> {
        const res = await fetch("https://randomuser.me/api/");
        const data = await res.json();
        return data.results[0];
      }

      if (!this.hasDataUser()) {
        const data = await fetchUser();
        this.useData = data;
        localStorage.setItem("user", JSON.stringify(data));
      }
    },

    logout(): void {
      this.clearDataUser();
    },

    getDataUser(): iUser | null {
      return this.useData;
    },

    clearDataUser(): void {
      localStorage.removeItem("user");
      this.useData = null;
    },

    hasDataUser(): boolean {
      return this.useData != null;
    },
  },
});
