/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dodger: {
          50: '#eaf4ff',
          100: '#d3e9ff',
          200: '#a8d3ff',
          300: '#72b8fd',
          400: '#3f9cf5',
          500: '#0f83ea',
          600: '#0171dd',
          700: '#0159b0',
          800: '#0b4d8f',
          900: '#093a6b',
          950: '#062544',
        },
        amrYellow: {
          400: '#f4b942',
        },
      },
      fontFamily: {
        khaled: ['"Lalezar"', 'sans-serif'],
        messiri: ['"El Messiri"', 'serif'],
        ibm: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        fs: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        com: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
