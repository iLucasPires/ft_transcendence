import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore", {
  state: function () {
    return {
      log: [] as string[],
      tab: "all",
      theme: "dark",
      gameP5Instance: null as any,
      modalLeaveGame: false,
    };
  },

  actions: {
    setTheme() {
      this.theme =
        localStorage.getItem("data-theme") ||
        window.matchMedia("(prefers-color-scheme: dark)")
          ? "dark"
          : "light";
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    changeModalLeaveGame() {
      this.modalLeaveGame = !this.modalLeaveGame;
    },

    changeMessageLog(messagesLog: string | string[]) {
      const messagesLogIsArray = Array.isArray(messagesLog);

      messagesLogIsArray ? this.log.push(...messagesLog) : this.log.push(messagesLog);

      setTimeout(() => (messagesLogIsArray ? this.log.splice(0, messagesLog.length) : this.log.shift()), 3000);
    },

    changeTab(tab: string) {
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
