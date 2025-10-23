/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          "0%, 80%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        fadeOut: "fadeOut 3s forwards",
      },
    },
  },
  plugins: [],
}
