import { defineStore } from "pinia";

const themes = ["light", "dark"];
const domHtml = document.querySelector("html");

export const useAppStore = defineStore("store", {
  state: () => {
    const prefersDarkScheme = window?.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const prefersTheme = prefersDarkScheme?.matches ? themes[1] : themes[0];

    return {
      navBarExpand: true,
      tabSelected: 0,
      logGlobal: "",
      gameP5: null as any,
      themeGlobal: localStorage.getItem("theme") || prefersTheme,
      modalUpdateProfile: null as HTMLDialogElement | null,
    };
  },

  actions: {
    setModalUpdateProfile() {
      this.modalUpdateProfile = document.querySelector("#modalUpdate");
    },

    toggleMenu() {
      this.navBarExpand = !this.navBarExpand;
    },

    changeStatusErro(erro: string) {
      this.logGlobal = erro;
    },

    changeTabSelected(tab: number) {
      this.tabSelected = tab;
    },

    changeGlobalTheme() {
      this.themeGlobal = this.themeGlobal === themes[0] ? themes[1] : themes[0];
      domHtml?.setAttribute("data-theme", this.themeGlobal);
      localStorage.setItem("theme", this.themeGlobal);
    },

    openModalUpdateProfile() {
      this.modalUpdateProfile?.showModal();
    },

    closeModalUpdateProfile() {
      this.modalUpdateProfile?.close();
    },
  },
  getters: {
    isDarkTheme: (state) => state.themeGlobal === themes[1],
  },
});
