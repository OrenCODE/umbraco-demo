/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'spinner-grow': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: {
        'spinner-grow': 'spinner-grow 0.75s linear infinite',
      },
    },
  },
  plugins: [],
};
