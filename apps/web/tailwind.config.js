
/** @type {import('tailwindcss').Config} */

function generateScale(name) {
  let scale = Array.from({ length: 12 }, (_, i) => {
    let id = i + 1;
    return [
      [id, `var(--${name}${id})`],
      [`a${id}`, `var(--${name}A${id})`],
    ];
  }).flat();

  return Object.fromEntries(scale);
}

module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    colors: ({ colors }) => ({
      ...colors,
    }),
    extend: {
      colors: {
        gray: generateScale("gray"),
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
