/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["IBM Plex Sans"],
      serif: [],
      mono: [],
    },
  },
  plugins: [require("tailwind-scrollbar"), require("daisyui")],
};
