import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        postech: {
          red:    "#A61955",
          "red-dark": "#8a1346",
          "red-light": "#f5e6ed",
          orange: "#F6A700",
          "orange-dark": "#d48f00",
          "orange-light": "#fef6e0",
          gray:   "#7A7772",
          silver: "#C5C6CA",
          gold:   "#DAB865",
        },
      },
    },
  },
  plugins: [],
};
export default config;
