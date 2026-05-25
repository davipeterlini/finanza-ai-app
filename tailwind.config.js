export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: { xs: "475px" },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "DM Sans", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
        emerald: {
          400: "#34d399",
          500: "#10B981",
          600: "#059669",
        },
        slate: {
          850: "#1a2332",
          900: "#0f172a",
          950: "#020617",
        },
      },
    },
  },
  plugins: [],
};