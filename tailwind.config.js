/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        paper: "#f2f0ea",
        smoke: "#8a8a86",
      },
      fontFamily: {
        grotesk: ["var(--font-space-grotesk)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-space-mono)", "monospace"],
        bricolage: ["var(--font-bricolage)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
