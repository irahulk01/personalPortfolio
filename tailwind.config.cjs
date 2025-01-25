/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        caviateFont: ['Caveat', 'cursive']
      },
      colors: {
        textHeaderColor: "#8c90aa",
        textColor: "#4e5463",
        darkHeadingColor: "#3e4355",
        highLighter: "#ff033e",
      },
      animation: {
        'write': 'write 2s steps(40, end) infinite',
      },
    },
  },
  plugins: [],
};
