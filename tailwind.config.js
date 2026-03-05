/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f4c3',
          100: '#e6ed95',
          200: '#d4e157',
          300: '#c8db39',
          400: '#b0bf00',
          500: '#b0bf00',
          600: '#b0bf00',
          700: '#8a9d00',
          800: '#757f00',
          900: '#5c6400',
        },
      },
    },
  },
  plugins: [],
}