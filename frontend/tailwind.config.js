/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#050607',
          charcoal: '#0B0F12',
          'charcoal-light': '#11171C',
          cyan: '#00CFFF',
          'cyan-bright': '#19D8FF',
          'cyan-dark': '#008EAF',
          white: '#F5F7FA',
          muted: '#AEB7BF',
          pink: '#FF2DA6',
          yellow: '#F5E642',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'Anton', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(0,207,255,0.07) 1px, transparent 1px)",
        'radial-glow': 'radial-gradient(circle at center, rgba(0,207,255,0.15) 0%, rgba(5,6,7,0) 70%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 10px rgba(0, 207, 255, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 22px rgba(25, 216, 255, 0.8))' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
