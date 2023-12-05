import { router } from "./router";
import type { iUser } from "./types/props";

const URL = import.meta.env.VITE_BACKEND_URL;

export default {
  getMe: async function (): Promise<iUser | null> {
    const response = await fetch(`${URL}/api/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");

      return null;
    }

    return null;
  },
  getAvatarMe: function (avatarUrl: string | null) {
    if (avatarUrl === null || avatarUrl === "") {
      return null;
    }

    const imgURL = URL + avatarUrl;
    return imgURL;
  },

  getAllUsers: async function () {
    const response = await fetch(`${URL}/api/users`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");
      return null;
    }

    return null;
  },

  updateUsernameMe: async function (newUsername: string) {
    const response = await fetch(`${URL}/api/me/`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");
      return null;
    }

    return null;
  },

  async updateAvatarMe(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${URL}/api/me/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (response.status >= 200 && response.status < 300) {
      return await response.json();
    }

    if (response.status === 403) {
      router.push({ name: "login" });
      localStorage.removeItem("user");
      return null;
    }

    return null;
  },
};
