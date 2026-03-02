/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        'primary-dark': '#EA580C',
        background: '#FFF7ED',
        surface: '#FFFFFF',
        'text-primary': '#1C1917',
        'text-secondary': '#78716C',
      },
    },
  },
  plugins: [],
};
