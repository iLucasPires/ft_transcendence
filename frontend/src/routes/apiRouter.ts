import Cookies from "js-cookie";
import { router } from "./vueRouter";

const URL = import.meta.env.VITE_BACKEND_URL;

export default {
  handleNotAuth: function () {
    router.push({ name: "login" });
    localStorage.removeItem("user");
  },

  handleInvalidCookie: function () {
    router.push({ name: "login" });
    
    Cookies.remove("connect.sid");
    Cookies.remove("connect.flag");
    localStorage.removeItem("user");

  },

  handleResponseToJson: async function (res: Response) {
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));

    return data;
  },

  getMeData: async function (): Promise<Response | null> {
    return fetch(`${URL}/api/me`, {
      method: "GET",
      credentials: "include",
    });
  },

  getAllUsers: async function () {
    return await fetch(`${URL}/api/users`, {
      method: "GET",
      credentials: "include",
    });
  },

  getAllBlockedUsers: async function () {
    return await fetch(`${URL}/api/me/blocked`, {
      method: "GET",
      credentials: "include",
    });
  },

  updateUsernameMe: async function (newUsername: string) {
    return await fetch(`${URL}/api/me`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
    });
  },

  async updateAvatarMe(formData: FormData) {
    return await fetch(`${URL}/api/me/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  },

  async logout() {
    return await fetch(`${URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  async blockUser(username: string) {
    return await fetch(`${URL}/api/users/${username}/block`, {
      method: "POST",
      credentials: "include",
    });
  },

  async unblockUser(username: string) {
    return await fetch(`${URL}/api/users/${username}/unblock`, {
      method: "POST",
      credentials: "include",
    });
  }
};
