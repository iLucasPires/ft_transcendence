import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("theme", {
  state: function () {
    return { theme: "light" };
  },

  actions: {
    initializeTheme() {
      this.theme = localStorage.getItem("theme") || "light";
      document.querySelector("html")?.setAttribute("data-theme", this.theme);
    },
    
    toggleTheme() {
      if (this.theme) {
        this.theme = this.theme === "dark" ? "light" : "dark";
        document.querySelector("html")?.setAttribute("data-theme", this.theme);
        localStorage.setItem("theme", this.theme);
      }
    },

    isDarkTheme(): boolean {
      return this.theme === "dark";
    },
  },
});
