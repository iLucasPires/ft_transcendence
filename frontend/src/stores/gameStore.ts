import { defineStore } from "pinia";

export default defineStore("game", {
  state: () => {
    return {
      loding: false,
    };
  },

  actions: {
    setLoading(value: boolean) {
      this.loding = value;
    },

    reset() {
      this.loding = false;
    },
  },
});
