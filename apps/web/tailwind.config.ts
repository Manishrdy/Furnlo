import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c49a3c',
          light: '#e0b86a',
          dark: '#9a7a28',
        },
        navy: {
          950: '#030812',
          900: '#050d1a',
          800: '#0a1628',
          700: '#0f1e38',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};

export default config;
