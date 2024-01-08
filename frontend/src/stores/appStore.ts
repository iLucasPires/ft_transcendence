import { defineStore } from "pinia";

function getPreferredTheme() {
  return window?.matchMedia("(prefers-color-scheme: dark)").matches
    ? "light"
    : "dark";
}

export const useAppStore = defineStore("appStore", {
  state: function () {
    return {
      log: "",
      tab: "all",
      themeGlobal: "dark",

      gameP5: null as any | null,
      modalLeaveGame: null as HTMLDialogElement | null,

      domHtml: document.querySelector("html"),
    };
  },

  actions: {
    setModalLeaveGame() {
      this.modalLeaveGame = document.querySelector("#modalLeaveGame");
    },

    setThemeGlobal() {
      this.themeGlobal = localStorage.getItem("theme") || getPreferredTheme();
      this.domHtml?.setAttribute("data-theme", this.themeGlobal);
    },

    changeMessageLog(log: string) {
      this.log = log;
      setTimeout(() => (this.log = ""), 5000);
    },

    changetab(tab: string) {
      this.tab = tab;
    },

    changeTheme() {
      this.themeGlobal = this.themeGlobal === "dark" ? "light" : "dark";
      this.domHtml?.setAttribute("data-theme", this.themeGlobal);
      this.changeMessageLog(`Theme changed to ${this.themeGlobal}`);

      localStorage.setItem("theme", this.themeGlobal);
    },

    openModalLeaveGame() {
      this.modalLeaveGame?.showModal();
    },

    closeModalLeaveGame() {
      this.modalLeaveGame?.close();
    },
  },
  getters: {
    isDarkTheme: (state) =>
      state?.themeGlobal === "dark" ? "md-modenight" : "md-sunny",
  },
});
