/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#556b2f', // color verde oscuro del header
        'custom-grey': 'rgba(100, 98, 98, 0.65);', // color gris oscuro
      }
    },
  },
  plugins: [],
}