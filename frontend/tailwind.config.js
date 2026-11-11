/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FCFBF8',
          100: '#FAF7F2',
          200: '#F4ECE0',
          300: '#E9DEC9',
          400: '#DACAB0',
        },
        maroon: {
          50: '#FAF2F2',
          100: '#F5E4E4',
          200: '#E8BFBF',
          600: '#8E1B1B',
          700: '#751414',
          800: '#5C0F0F',
          900: '#420A0A',
        },
        gold: {
          50: '#FAF7ED',
          100: '#F4EDD4',
          200: '#E9DAA9',
          400: '#D4AF37',
          500: '#C5A059',
          600: '#A98337',
          700: '#846424',
        },
        charcoal: {
          500: '#686873',
          700: '#3E3E47',
          800: '#282830',
          900: '#1A1A20',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
