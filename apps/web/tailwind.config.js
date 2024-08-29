/** @type {import('tailwindcss').Config} */

const {
  blackA,
  whiteA,
  violet,
  mauve,
  mauveDark,
  red,
  gray,
  grayA,
  green,
  indigo,
  indigoDark,
} = require("@radix-ui/colors");

console.error(mauve.mauve2);

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      ...colors,
    }),
    extend: {
      colors: {
        ...blackA,
        ...violet,
        ...mauve,
        ...mauveDark,
        ...whiteA,
        ...red,
        ...gray,
        ...grayA,
        ...green,
        ...indigo,
        ...indigoDark,
        app: {
          DEFAULT: "var(--page-background)",
          foreground: "var(--gray-12)",
        },
        cell: {
          DEFAULT: "var(--cell-background)",
          foreground: "var(--mauve-12)",
        },
        accent: {
          DEFAULT: "var(--accent-12))",
          1: "var(--accent-1)",
          2: "var(--accent-2)",
          3: "var(--accent-3)",
          4: "var(--accent-4)",
          5: "var(--accent-5)",
          6: "var(--accent-6)",
          7: "var(--accent-7)",
          8: "var(--accent-8)",
          9: "var(--accent-9)",
          10: "var(--accent-10)",
          11: "var(--accent-11)",
          12: "var(--accent-12)",
        },
      },
      gridTemplateAreas: {
        layout: ["top-bar top-bar", "left-sidebar main-view"],
        "hide-left-sidebar-layout": ["top-bar", "main-view"],
        view: ["top-bar top-bar", "left-toc content"],
        "hide-left-sidebar-view": ["top-bar", "content"],
      },
    },
  },
  plugins: [
    // require("@tailwindcss/typography"),
    require("@savvywombat/tailwindcss-grid-areas"),
  ],
};
