import { defineStore } from "pinia";

export const useAppStore = defineStore("appStore", {
  state: function () {
    return {
      log: [] as string[],

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
      this.themeGlobal = localStorage.getItem("theme") || "dark";
      this.domHtml?.setAttribute("data-theme", this.themeGlobal);
    },

    changeMessageLog(messagesLog: string | string[]) {
      const messagesLogIsArray = Array.isArray(messagesLog);

      messagesLogIsArray
        ? this.log.push(...messagesLog)
        : this.log.push(messagesLog);

      setTimeout(
        () =>
          messagesLogIsArray
            ? this.log.splice(0, messagesLog.length)
            : this.log.shift(),
        3000
      );
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
    getIconByTheme: (state) =>
      state?.themeGlobal === "dark" ? "md-modenight" : "md-sunny",
  },
});
