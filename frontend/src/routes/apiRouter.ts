import Cookies from "js-cookie";

const URL = import.meta.env.VITE_BACKEND_URL;
const JSON_HEADER = { "Content-Type": "application/json" };

export const utils = {
  handleInvalidCookie: function (res: Response) {
    if (res.status === 401 || res.status === 403) {
      Cookies.remove("connect.sid");
      Cookies.remove("connect.flag");
    }
  },

  handleResSaveStorage: async function (res: Response, key: string = "user") {
    const dataJson = await res.json();

    localStorage.setItem(key, JSON.stringify(dataJson));
    return dataJson;
  },

  handleMessage: async function (res: Response) {
    const { message } = await res.json();
    return message;
  },

  newFormData: function (file: File | null, key: string = "file") {
    const formData = new FormData();
    if (file) formData.append(key, file);
    return formData;
  },

  safeFetch: async function (
    url: string,
    method: string = "GET",
    body: BodyInit | null = null,
    headers: HeadersInit | undefined = undefined,
    removeCookie: boolean = true
  ) {
    const res = await fetch(`${URL}/api/${url}`, {
      method: method,
      credentials: "include",
      headers: headers,
      body: body,
    });
    removeCookie && utils.handleInvalidCookie(res);
    return res;
  },
};

export const api = {
  getMeData: async function () {
    const res = await utils.safeFetch("me");
    return res;
  },

  async logout() {
    const res = await utils.safeFetch("auth/logout", "POST");
    return res;
  },

  getAllUsers: async function () {
    const res = await utils.safeFetch("users");
    return res;
  },

  getAllBlockedUsers: async function () {
    const res = await utils.safeFetch("me/blocked");
    return res;
  },

  getAllFriends: async function () {
    const res = await utils.safeFetch("me/friends");
    return res;
  },

  updateUsernameMe: async function (newUsername: string) {
    const data = JSON.stringify({ username: newUsername });
    const res = await utils.safeFetch("me", "PATCH", data, {
      "Content-Type": "application/json",
    });
    return res;
  },

  async updateAvatarMe(file: File) {
    const formData = utils.newFormData(file);
    const res = await utils.safeFetch("me/avatar", "POST", formData, undefined);
    return res;
  },

  async blockUser(username: string) {
    const res = await utils.safeFetch(`users/${username}/block`, "POST");
    return res;
  },

  async unblockUser(username: string) {
    const res = await utils.safeFetch(`users/${username}/unblock`, "POST");
    return res;
  },

  async addFriend(username: string) {
    const res = await utils.safeFetch(`users/${username}/friend`, "POST");
    return res;
  },

  async unfriend(username: string) {
    const res = await utils.safeFetch(`users/${username}/unfriend`, "POST");
    return res;
  },

  async enable2fa(code: string) {
    const res = await utils.safeFetch(
      "auth/2fa/turn-on",
      "POST",
      JSON.stringify({ code }),
      JSON_HEADER,
      false
    );
    return res;
  },

  async disable2fa(code: string) {
    const res = await utils.safeFetch(
      "auth/2fa/turn-off",
      "POST",
      JSON.stringify({ code }),
      JSON_HEADER,
      false
    );
    return res;
  },

  async generate2fa() {
    const res = await utils.safeFetch("auth/2fa/generate", "POST");
    return res;
  },

  async verify2fa(code: string) {
    const res = await utils.safeFetch(
      "auth/2fa/verify",
      "POST",
      JSON.stringify({ code }),
      JSON_HEADER,
      false
    );
    return res;
  },
};
