import { defineStore } from "pinia";
import type { RouteRecordName } from "vue-router";

type UserViewTabs = "all" | "friends" | "blocked";

export const useAppStore = defineStore("appStore", {
  state: function () {
    return {
      log: [] as string[],
      logTimeout: null as NodeJS.Timeout | null,
      tab: "all" as UserViewTabs,
      theme: "dark",
      leaveGameTo: undefined as RouteRecordName | undefined,
      modalLeaveGame: false,
      modalProfile: false,
      modalSearch: false,
      modalCreateGroupChannel: false,
    };
  },

  actions: {
    setTheme() {
      this.theme =
        localStorage.getItem("data-theme") || window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    changeModalLeaveGame(to?: RouteRecordName) {
      if (!!to) {
        this.leaveGameTo = to;
      }
      this.modalLeaveGame = !this.modalLeaveGame;
    },

    changeModalProfile() {
      this.modalProfile = !this.modalProfile;
    },

    changeModalSearch() {
      this.modalSearch = !this.modalSearch;
    },

    changeModalCreateGroupChannel() {
      this.modalCreateGroupChannel = !this.modalCreateGroupChannel;
    },

    changeMessageLog(messagesLog: string | string[]) {
      const messagesLogIsArray = Array.isArray(messagesLog);
      messagesLogIsArray ? this.log.push(...messagesLog) : this.log.push(messagesLog);
      if (this.logTimeout) {
        clearInterval(this.logTimeout);
      }
      this.logTimeout = setTimeout(() => (this.log = []), 3000);
    },

    changeTab(tab: UserViewTabs) {
      this.tab = tab;
    },

    changeTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.changeMessageLog(`Warning: Theme changed to ${this.theme}`);

      localStorage.setItem("data-theme", this.theme);
      document.documentElement.setAttribute("data-theme", this.theme);
    },
  },
  getters: {
    getIconByTheme: (state) => (state?.theme === "dark" ? "md-modenight" : "md-sunny"),
  },
});
