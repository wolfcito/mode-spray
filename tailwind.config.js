/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './utils/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('daisyui')],
  darkTheme: 'scaffoldEthDark',
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        scaffoldEth: {
          primary: '#000000',
          'primary-content': '#F5F5F5',
          secondary: '#333333',
          'secondary-content': '#F5F5F5',
          accent: '#C2C2C2',
          'accent-content': '#088484',
          neutral: '#222222',
          'neutral-content': '#DFFE00',
          'base-100': '#222222',
          'base-200': '#000000',
          'base-300': '#111111',
          'base-content': '#F5F5F5',
          info: '#C8F5FF',
          success: '#65D072',
          warning: '#F4BF4F',
          error: '#EC6A5E',

          '--rounded-btn': '9999rem',

          '.tooltip': {
            '--tooltip-tail': '6px',
          },
          '.link': {
            textUnderlineOffset: '2px',
          },
          '.link:hover': {
            opacity: '80%',
          },
        },
      },
      {
        scaffoldEthDark: {
          primary: '#000000',
          'primary-content': '#F5F5F5',
          secondary: '#333333',
          'secondary-content': '#F5F5F5',
          accent: '#C2C2C2',
          'accent-content': '#088484',
          neutral: '#222222',
          'neutral-content': '#DFFE00',
          'base-100': '#222222',
          'base-200': '#000000',
          'base-300': '#111111',
          'base-content': '#F5F5F5',
          info: '#C8F5FF',
          success: '#65D072',
          warning: '#F4BF4F',
          error: '#EC6A5E',

          '--rounded-btn': '9999rem',

          '.tooltip': {
            '--tooltip-tail': '6px',
            '--tooltip-color': 'oklch(var(--p))',
          },
          '.link': {
            textUnderlineOffset: '2px',
          },
          '.link:hover': {
            opacity: '80%',
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: '0 0 12px -2px rgb(0 0 0 / 0.05)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
}
