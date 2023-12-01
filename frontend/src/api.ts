import { router } from "./router";

const URL = import.meta.env.VITE_BACKEND_URL;

export default {
  getMe: async function () {
    const response = await fetch(`${URL}/api/me`, {
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
    const response = await fetch(`${URL}/api/users`, {
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

  updateUsernameMe: async function (newUsername: string) {
    const response = await fetch(`${URL}/api/me/`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newUsername }),
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

  async updateAvatarMe(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    console.log(formData);

    const res = await fetch(`${URL}/api/me/avatar`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    console.log(res);
    
  },
};
