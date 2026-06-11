import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─── Midnight Indigo Palette ────────────────────────────────────────────
      colors: {
        // Sidebar
        sidebar: {
          DEFAULT: '#0F0F1A',
          hover: '#1C1B2E',
          active: '#1C1B2E',
          text: '#7B79A0',
          'text-active': '#FFFFFF',
          border: '#1C1B2E',
          icon: '#4C4A72',
          'icon-active': '#5046E4',
        },
        // Accent
        accent: {
          DEFAULT: '#5046E4',
          hover: '#3D34C4',
          light: '#EEF0FF',
        },
        // Cyan pop
        cyan: {
          pop: '#22D3EE',
          light: '#E0F9FF',
        },
        // Brand base
        brand: {
          bg: '#F7F7FF',
          surface: '#FFFFFF',
          border: '#E8E6F8',
          text: '#0F0F1A',
          muted: '#6B6888',
        },
        // Semantic
        success: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
          text: '#047857',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFF7ED',
          text: '#B45309',
        },
        danger: {
          DEFAULT: '#F43F5E',
          light: '#FEF2F2',
          text: '#991B1B',
        },
      },
      // ─── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // ─── Border Radius ───────────────────────────────────────────────────────
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      // ─── Sidebar Width ───────────────────────────────────────────────────────
      width: {
        sidebar: '220px',
      },
      marginLeft: {
        sidebar: '220px',
      },
      // ─── Animations ──────────────────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
