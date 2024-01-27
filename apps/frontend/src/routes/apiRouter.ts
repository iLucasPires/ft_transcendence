import Cookies from "js-cookie";

const JSON_HEADER = { "Content-Type": "application/json" };

export const utils = {
  handleMessage: async function (res: Response) {
    const { message } = await res.json();
    return message;
  },

  handleForbidden: async function (res: Response) {
    if (res.status === 403 || res.status === 401) {
      Cookies.remove("connect.sid");
      Cookies.remove("connect.flag");
      window.location.href = "/login";
    }
  },

  newFormData: function (file: File | null, key: string = "file") {
    const formData = new FormData();
    if (file) formData.append(key, file);
    return formData;
  },

  clearCookies: function () {
    Cookies.remove("connect.sid");
    Cookies.remove("connect.flag");
  },

  safeFetch: async function (
    url: string,
    method: string = "GET",
    body: BodyInit | null = null,
    headers: HeadersInit | undefined = undefined
  ) {
    const res = await fetch(`/api/${url}`, {
      method: method,
      credentials: "include",
      headers: headers,
      body: body,
    });
    return res;
  },
};

export const api = {
  getMeData: async function () {
    const res = await utils.safeFetch("me");
    utils.handleForbidden(res);
    return res;
  },

  getAllUsers: async function () {
    const res = await utils.safeFetch("users");
    utils.handleForbidden(res);
    return res;
  },

  getAllBlockedUsers: async function () {
    const res = await utils.safeFetch("me/blocked");
    utils.handleForbidden(res);
    return res;
  },

  getAllFriends: async function () {
    const res = await utils.safeFetch("me/friends");
    utils.handleForbidden(res);
    return res;
  },

  updateUsernameMe: async function (newUsername: string) {
    const data = JSON.stringify({ username: newUsername });
    const res = await utils.safeFetch("me", "PATCH", data, {
      "Content-Type": "application/json",
    });
    utils.handleForbidden(res);
    return res;
  },

  async updateAvatarMe(file: File) {
    const formData = utils.newFormData(file);
    const res = await utils.safeFetch("me/avatar", "POST", formData, undefined);
    utils.handleForbidden(res);
    return res;
  },

  async blockUser(username: string) {
    const res = await utils.safeFetch(`users/${username}/block`, "POST");
    utils.handleForbidden(res);
    return res;
  },

  async unblockUser(username: string) {
    const res = await utils.safeFetch(`users/${username}/unblock`, "POST");
    utils.handleForbidden(res);
    return res;
  },

  async addFriend(username: string) {
    const res = await utils.safeFetch(`users/${username}/friend`, "POST");
    utils.handleForbidden(res);
    return res;
  },

  async unfriend(username: string) {
    const res = await utils.safeFetch(`users/${username}/unfriend`, "POST");
    utils.handleForbidden(res);
    return res;
  },

  async enable2fa(code: string) {
    const res = await utils.safeFetch(
      "auth/2fa/turn-on",
      "POST",
      JSON.stringify({ code }),
      JSON_HEADER
    );
    return res;
  },

  async disable2fa(code: string) {
    const res = await utils.safeFetch(
      "auth/2fa/turn-off",
      "POST",
      JSON.stringify({ code }),
      JSON_HEADER
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
      JSON_HEADER
    );
    return res;
  },
};
