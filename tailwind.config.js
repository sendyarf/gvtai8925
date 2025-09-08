/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        surface: '#1E1E1E',
        accent: '#BB86FC',
        'secondary-accent': '#03DAC6',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
      },
      animation: {
        'fade-in-out': 'fadeInOut 2s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 1 },
        }
      }
    },
  },
  plugins: [],
}