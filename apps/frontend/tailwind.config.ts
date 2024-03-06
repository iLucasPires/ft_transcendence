import daisyuiCss from "daisyui";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [daisyuiCss],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#8979F2",
          secondary: "#F5A532",
          accent: "#27F27F",
          neutral: "#F2F2F2",
          "base-100": "#171717",
          info: "#00a5c4",
          success: "#008900",
          warning: "#b83000",
          error: "#ff005e",
        },
        light: {
          primary: "#8979F2",
          secondary: "#D63F2C",
          accent: "#27F27F",
          neutral: "#F2F2F2",
          "base-100": "#DEDEDE",
          info: "#00a5c4",
          success: "#008900",
          warning: "#b83000",
          error: "#ff005e",
        },
      },
    ],
  },
} as Config;
