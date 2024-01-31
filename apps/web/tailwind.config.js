// tailwind.config.js
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "var(--canvasBackground)",
          foreground: "var(--canvasForeground)",
        },
        panel: {
          DEFAULT: "var(--panelBackground)",
          foreground: "var(--panelForeground)",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
