/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canberry: {
          yellow: '#FFF98D',
          yellowLight: '#FFFDE0',
          yellowHover: '#FFF56E',
          brown: '#684017',
          brownDark: '#4A2B0C',
          brownLight: '#8D5620',
          green: '#3B6B35',
          cream: '#FAF6EE',
          creamLight: '#FCFAF5',
          dark: '#1C1C1C',
          muted: '#666666',
        },
      },
      fontFamily: {
        serif: ['"Ancizar Serif"', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'button': '8px',
      },
    },
  },
  plugins: [],
};
