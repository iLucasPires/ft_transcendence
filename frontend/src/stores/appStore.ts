import { defineStore } from "pinia";

const themes = ["light", "dark"];
const domHtml = document.querySelector("html");

export const useAppStore = defineStore("store", {
  state: () => {
    return {
      navBarExpand: true,
      loddingGlobal: false,
      tabSelected: "all",
      logGlobal: "",
      gameP5: null as any,
      themeGlobal: themes[0],

      modalUpdateProfile: null as HTMLDialogElement | null,
      modalLeaveGame: null as HTMLDialogElement | null,
    };
  },

  actions: {
    setModalUpdateProfile() {
      this.modalUpdateProfile = document.querySelector("#modalUpdate");
    },

    setModalLeaveGame() {
      this.modalLeaveGame = document.querySelector("#modalLeaveGame");
    },

    setThemeGlobal() {
      const localTheme = localStorage.getItem("theme");
      const prefersDarkScheme = window?.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      const prefersTheme = prefersDarkScheme?.matches ? themes[1] : themes[0];

      this.themeGlobal = localTheme ? localTheme : prefersTheme;
      domHtml?.setAttribute("data-theme", this.themeGlobal);
    },

    toggleMenu() {
      this.navBarExpand = !this.navBarExpand;
    },

    changeMessageLog(erro: string) {
      this.logGlobal = erro;
    },

    changeLoadingGlobal() {
      this.loddingGlobal = !this.loddingGlobal;
    },

    changeTabSelected(tab: string) {
      this.tabSelected = tab;
    },

    changeGlobalTheme() {
      this.themeGlobal = this.themeGlobal === themes[0] ? themes[1] : themes[0];
      domHtml?.setAttribute("data-theme", this.themeGlobal);
      localStorage.setItem("theme", this.themeGlobal);
      this.logGlobal = `Theme changed to ${this.themeGlobal}`;
    },

    openModalUpdateProfile() {
      this.modalUpdateProfile?.showModal();
    },

    closeModalUpdateProfile() {
      this.modalUpdateProfile?.close();
    },

    openModalLeaveGame() {
      this.modalLeaveGame?.showModal();
    },

    closeModalLeaveGame() {
      this.modalLeaveGame?.close();
    },
  },
  getters: {
    isDarkTheme: (state) => state?.themeGlobal === themes[1],
  },
});
