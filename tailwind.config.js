/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        paper: '#F8F7F4',
        surface: '#FFFFFF',
        ink: {
          900: '#1B1A17',
          700: '#3D3A35',
          500: '#55524C',
          400: '#8A867E',
          300: '#A29D94',
          200: '#B8B3A9',
        },
        line: {
          DEFAULT: '#E4E1DA',
          soft: '#EFEDE8',
          strong: '#D3CFC6',
        },
        accent: {
          DEFAULT: '#1D5B52',
          dark: '#164A43',
          tint: '#EAF1EF',
        },
        danger: {
          DEFAULT: '#8E2C22',
          border: '#C0736A',
          tint: '#F7EBE8',
          hover: '#F2DFDB',
        },
      },
      boxShadow: {
        dialog: '0 24px 48px -12px rgba(27,26,23,0.28), 0 2px 6px rgba(27,26,23,0.06)',
      },
    },
  },
  plugins: [],
}
