import { defineStore } from "pinia";

function getPreferredTheme() {
  return window?.matchMedia("(prefers-color-scheme: dark)").matches
    ? "light"
    : "dark";
}

export const useAppStore = defineStore("store", {
  state: () => {
    return {
      loddingGlobal: false,

      logGlobal: "",
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
      this.logGlobal = log;
    },

    changeLoadingGlobal() {
      this.loddingGlobal = !this.loddingGlobal;
    },

    changetab(tab: string) {
      this.tab = tab;
    },

    changeGlobalTheme() {
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
    isLodding: (state) => state?.loddingGlobal,
    isDarkTheme: (state) => state?.themeGlobal === "dark",
  },
});
