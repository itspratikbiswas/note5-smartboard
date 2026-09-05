/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chalkboard: {
          green: "#1e3f20",
          darkgreen: "#142c16",
          black: "#121316",
          navy: "#0f172a",
        }
      },
      boxShadow: {
        'board': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 0, 0, 0.2)',
        'tool': '0 8px 30px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        'glow': '0 0 15px rgba(56, 189, 248, 0.5)'
      }
    },
  },
  plugins: [],
}
