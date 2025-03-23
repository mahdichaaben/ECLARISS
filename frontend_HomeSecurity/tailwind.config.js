/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        'moon-dark': '#0B0C10',
        'moon-grey': '#909090',
        'moon-blue': '#0095B6',
        'moon-light-blue': '#45A29E',
        'moon-light': '#F2F2F2',
      },


    },
  },
  plugins: [],
}

