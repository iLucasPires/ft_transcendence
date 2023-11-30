import { router } from "./router";

export default {
  getMe: async function () {
    const response = await fetch("http://localhost:3000/api/me", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");

      return null;
    }
  },

  getAllUsers: async function () {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");

      return null;
    }
  },

  updateUsernameMe: async function (username: string, newUsername: string) {
    const response = await fetch(
      "http://localhost:3000/api/users/" + username,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername }),
      }
    );

    if (response.status === 200) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");

      return null;
    }
  },
};
