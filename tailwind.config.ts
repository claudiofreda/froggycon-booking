import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#f59e0b",

          secondary: "#f97316",

          accent: "#2dd4bf",

          "base-100": "#fffdf1",

          neutral: "#281b1c",

          info: "#60a5fa",

          success: "#84cc16",

          warning: "#fde047",

          error: "#be123c",
        },
      },
    ],
  },

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [daisyui],
};
export default config;
