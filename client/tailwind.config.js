/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        base: {
          DEFAULT: '#0a0a0f',
          50: '#16161d',
          100: '#1a1a24',
          200: '#22222e',
          300: '#2a2a38',
          400: '#353545',
          500: '#454558',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          light: 'rgba(255, 255, 255, 0.06)',
          medium: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-light': 'rgba(255, 255, 255, 0.12)',
          amber: 'rgba(245, 158, 11, 0.08)',
          'amber-strong': 'rgba(245, 158, 11, 0.15)',
          emerald: 'rgba(16, 185, 129, 0.08)',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#f87171',
        },
        warning: {
          DEFAULT: '#f59e0b',
        },
      },
      boxShadow: {
        'glass': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 16px 48px rgba(0, 0, 0, 0.5)',
        'glass-glow': '0 0 20px rgba(245, 158, 11, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-glow-strong': '0 0 40px rgba(245, 158, 11, 0.12), 0 16px 48px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 1px 1px rgba(255, 255, 255, 0.06)',
        'ambient': '0 0 60px rgba(245, 158, 11, 0.05)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-lg': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'glass-border': 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(255,255,255,0.05), rgba(16,185,129,0.15))',
        'accent-gradient': 'linear-gradient(135deg, #f59e0b, #d97706)',
        'card-shine': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
