export const THEMES = ["light", "dark"];
export const DOMHtml = document.querySelector("html");

export function initThemeData() {
  const localStorageTheme = localStorage.getItem("theme");
  if (localStorageTheme) DOMHtml?.setAttribute("data-theme", localStorageTheme);
  else {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme = prefersDarkMode ? THEMES[1] : THEMES[0];
    DOMHtml?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
}
