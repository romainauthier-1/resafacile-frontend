/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#B8958A", // Marron
        primaryLight: "#DFCEC8", // Marron clair
        secondary: "#8AADB8", // Bleu gris
        secondaryLight: "#C9D9DE", // Bleu gris clair
        white: "#FFFFFF",
        text: "#536176",
        muted: "#8692a7",
        lightGray: "#c4c9cd",
        background: "#958AB8", // Violet foncé
        backgroundLight: "#E2DEEB", // Violet clair
        destructive: "#ca0d0d",
      },
    },
  },
  plugins: [],
};
