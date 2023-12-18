import type { Config } from "tailwindcss";
import daisyuiCss from "daisyui";


export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [daisyuiCss],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#F21905",
          secondary: "#4218D9",
          accent: "#3A15BF",
          neutral: "#1A0859",
          "base-100": "#0D0D0D",
          info: "#00d9fa",
          success: "#00c895",
          warning: "#a16f00",
          error: "#eb003b",
        },
      },
      "light",
      "dark",
    ],
  },
} as Config;
