/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base:    'rgb(var(--bg-base)    / <alpha-value>)',
          surface: 'rgb(var(--bg-surface) / <alpha-value>)',
          subtle:  'rgb(var(--bg-subtle)  / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border-color) / <alpha-value>)',
        },
        accent: {
          green: 'rgb(var(--accent-green) / <alpha-value>)',
          blue:  'rgb(var(--accent-blue)  / <alpha-value>)',
          amber: 'rgb(var(--accent-amber) / <alpha-value>)',
          red:   'rgb(var(--accent-red)   / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          muted:   'rgb(var(--text-muted)   / <alpha-value>)',
        },
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 3s ease-in-out infinite',
        'shake':      'shake 0.5s ease-in-out',
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.5)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-3px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        'live-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}
