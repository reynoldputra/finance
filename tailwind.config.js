/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /_(cols|rows)-(.+)/,
      variants: ["sm", "md", "lg", "xl"],
    },
    {
      pattern: /grid-(rows|cols)-(.+)/,
      variants: ["sm", "md", "lg", "xl"],
    }
  ],
  plugins: [
    plugin(({ addComponents }) => {
      // grid
      const [_, ...values] = [...Array(13).keys(), "full", "auto"];
      const gridRowCol = {};
      for (let start of values) {
        for (let span of values) {
          gridRowCol[`._cols-${start}_${span}`] = {
            gridColumnStart: `${start}`,
            gridColumnEnd: `span ${span}`,
          };

          gridRowCol[`._rows-${start}_${span}`] = {
            gridRowStart: `${start}`,
            gridRowEnd: `span ${span}`,
          };
        }
      }

      addComponents(gridRowCol);
    })
  ]}

