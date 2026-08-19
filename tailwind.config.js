/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#16232B",
        parchment: "#F3EEDD",
        parchment2: "#EAE2C8",
        teal: {
          DEFAULT: "#0F3D3E",
          dark: "#0A2B2C",
          light: "#175958"
        },
        gold: {
          DEFAULT: "#B8863B",
          light: "#D4AC63",
          dark: "#8C6425"
        },
        maroon: "#7A2E2E"
      },
      fontFamily: {
        display: ["'Noto Naskh Arabic'", "serif"],
        urdu: ["'Noto Nastaliq Urdu'", "serif"],
        body: ["'Inter'", "'Noto Sans'", "sans-serif"]
      },
      backgroundImage: {
        weave: "radial-gradient(circle at 1px 1px, rgba(184,134,59,0.15) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
