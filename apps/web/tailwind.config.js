
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    colors: ({ colors }) => ({
      ...colors,
    }),
    extend: {
      colors: {
        app: {
          DEFAULT: "var(--page-background)",
          foreground: "var(--gray-12)",
        },
        cell: {
          DEFAULT: "var(--mauve-2)",
          foreground: "var(--mauve-12)",
        }
      },
    },
  },
};
