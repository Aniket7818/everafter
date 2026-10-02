/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF7F2',
          light: '#FCFBF8',
          dark: '#F0EBE1',
        },
        champagne: {
          light: '#F4ECE0',
          DEFAULT: '#E8D8B9',
          dark: '#D8C29D',
        },
        gold: {
          light: '#D4BC8B',
          DEFAULT: '#B99A62',
          dark: '#937740',
          hover: '#A3844D',
        },
        rose: {
          light: '#EAD7D2',
          DEFAULT: '#D9B8B0',
          dark: '#BD968D',
        },
        sage: {
          light: '#C7D1BF',
          DEFAULT: '#AAB5A0',
          dark: '#8C9981',
        },
        charcoal: {
          DEFAULT: '#292725',
          light: '#3C3936',
          dark: '#1C1A19',
          900: '#141312',
          950: '#0E0D0C',
        },
        warmgray: {
          light: '#A39D97',
          DEFAULT: '#77716B',
          dark: '#58524D',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 39, 37, 0.05)',
        'luxury': '0 10px 30px -4px rgba(41, 39, 37, 0.08), 0 4px 12px -2px rgba(41, 39, 37, 0.03)',
        'gold-glow': '0 0 25px rgba(185, 154, 98, 0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
