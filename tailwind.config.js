const { antdPlugin } = require("tailwind-antd");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        consolas: ["Consolas", "monospace"],
      },
    },
  },
  plugins: [antdPlugin()],
};