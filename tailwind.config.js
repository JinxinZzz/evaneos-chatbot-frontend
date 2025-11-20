/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        evaneos: {
          dark: "#003526",   // Main green
          panel: "#003526",  // Logo rectangle background shade
          beige: "#F5F0E8",
        },
      },
    },
  },
  plugins: [],
};

