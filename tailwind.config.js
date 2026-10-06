/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        laser: {
          DEFAULT: '#f97316',
          light: '#fb923c',
          dark: '#c2410c',
        },
        neon: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#047857',
        },
        solar: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dark: '#b45309',
        },
        plasma: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2',
        },
        void: {
          DEFAULT: '#000000',
          dark: '#0a0a0a',
          light: '#111111',
        },
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'monospace'],
        mono: ['"VT323"', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4,0,0.6,1) infinite',
        'scan': 'scan 3s linear infinite',
        'glitch': 'glitch 0.3s infinite',
        'float-up': 'floatUp 3s ease-out infinite',
        'shake': 'shake 0.3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spinReverse 12s linear infinite',
        'breathe': 'breathe 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) scale(0.3)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        spinReverse: {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.05)', filter: 'brightness(1.3)' },
        },
      },
    },
  },
  plugins: [],
};
