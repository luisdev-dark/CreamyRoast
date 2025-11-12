/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f9f7f4',
          100: '#f1ece3',
          200: '#e6d9c5',
          300: '#d4b896',
          400: '#c19a6b',
          500: '#b8834b',
          600: '#a67442',
          700: '#8a5f3a',
          800: '#705035',
          900: '#5c4330',
        }
      }
    },
  },
  plugins: [],
}