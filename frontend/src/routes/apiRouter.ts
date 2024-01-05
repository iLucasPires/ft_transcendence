import Cookies from "js-cookie";
import { router } from "./vueRouter";

const URL = import.meta.env.VITE_BACKEND_URL;

export const api = {
  getMeData: async function () {
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

  getAllFriends: async function () {
    return await fetch(`${URL}/api/me/friends`, {
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
  },

  async addFriend(username: string) {
    return await fetch(`${URL}/api/users/${username}/friend`, {
      method: "POST",
      credentials: "include",
    });
  },

  async unfriend(username: string) {
    return await fetch(`${URL}/api/users/${username}/unfriend`, {
      method: "POST",
      credentials: "include",
    });
  },

  async enable2fa(code: string) {
    return await fetch(`${URL}/api/auth/2fa/turn-on`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
  },

  async disable2fa(code: string) {
    return await fetch(`${URL}/api/auth/2fa/turn-off`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
  },

  async generate2fa() {
    return await fetch(`${URL}/api/auth/2fa/generate`, {
      method: "POST",
      credentials: "include",
    });
  },

  async verify2fa(code: string) {
    return await fetch(`${URL}/api/auth/2fa/verify`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
  },
};
