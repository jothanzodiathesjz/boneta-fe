import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/**/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#4B4D65",
        primary: {
          main: "#00329A",
          surface: "#AADCFF",
          border: "#5082EA",
          hover: "#1446AE",
          pressed: "#001E86",
          focus: "#5082EA",
          logo: "#0C4E97",
          light: "#F0F7FF",
        },
        white: "#fff",
        black: "#0a0a0a",
        "off-white": "#F9FBFC",
        neutral: {
          10: "#0A0A0A",
          20: "#141414",
          30: "#262626",
          40: "#4E4E4E",
          50: "#767676",
          60: "#8A8A8A",
          70: "#9E9E9E",
          80: "#E0E0E0",
          90: "#F5F5F5",
          100: "#FFF",
        },
        success: {
          main: "#3BC13C",
          surface: "#E0F3E0",
          border: "#CCEBCC",
          hover: "#54A355",
          pressed: "#326233",
        },
        error: {
          main: "#FF0000",
          surface: "#FBD9D6",
          border: "#F9C0BA",
          hover: "#C53828",
          pressed: "#762118",
        },
        danger: {
          main: "#ED8B30",
          surface: "#FBE8D6",
          border: "#F9D8BA",
          hover: "#C57428",
          pressed: "#764518",
        },
        info: {
          main: "#3267E3",
          surface: "#F0F3FF",
          border: "#B1C5F6",
          hover: "#114CD6",
          pressed: "#11317D",
        },
        warning: {
          main: "#ffeb3b",
          surface: "#fff9c4",
          border: "#fff59d",
          hover: "#ffee58",
          pressed: "#fbc02d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
