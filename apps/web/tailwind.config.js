
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
} = require("@radix-ui/colors");

console.error(mauve.mauve2)

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
        ...blackA,
        ...violet,
        ...mauve,
        ...mauveDark,
        ...whiteA,
        ...red,
        ...gray,
        ...grayA,
        ...green,
        app: {
          DEFAULT: "var(--page-background)",
          foreground: "var(--gray-12)",
        },
        cell: {
          DEFAULT: "var(--mauve-2)",
          foreground: "var(--mauve-12)",
        }
      },
      gridTemplateAreas: {
        'layout': [
          'left-sidebar main-view',
        ],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('@savvywombat/tailwindcss-grid-areas'),
  ]
};
