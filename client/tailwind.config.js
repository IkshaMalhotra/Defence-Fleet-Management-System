/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          50: "#f5f5f0",
          100: "#e8e8d8",
          200: "#d0d0b0",
          300: "#b0b090",
          400: "#909070",
          500: "#787860",
          600: "#606050",
          700: "#484838",
          800: "#303028",
          900: "#1e1e18",
          950: "#111108",
        },
        olive: {
          400: "#8b956d",
          500: "#798463",
          600: "#65724f",
          700: "#576040",
          800: "#4d593d",
          900: "#3a4430",
        },
        tactical: {
          amber: "#c8960c",
          red: "#b02020",
          green: "#2d6a2d",
          blue: "#1a3a5c",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};