/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: {
          50: '#FFFcf8',
          100: '#F3EEE4',
          200: '#E8E0D2',
          300: '#D4C9B6',
          400: '#B8A992',
        },
        ink: {
          950: '#1C1916',
          800: '#2C2622',
          600: '#5C534C',
          400: '#8A8178',
          300: '#A89F94',
        },
        courtyard: {
          50: '#E8F0ED',
          100: '#D3E2DC',
          500: '#2F6B5A',
          600: '#265A4C',
          700: '#1F4A3E',
          800: '#17382F',
          900: '#102820',
        },
        brass: {
          300: '#C4A574',
          400: '#B8956A',
          500: '#9A7B4F',
          600: '#7A623E',
        },
        laterite: {
          400: '#C46A44',
          500: '#B85C38',
          600: '#9A4A2C',
        },
        charcoal: {
          950: '#1C1916',
          900: '#241F1B',
          800: '#2C2622',
          700: '#3A322C',
          600: '#4A4038',
        },
        gold: {
          300: '#C4A574',
          400: '#B8956A',
          500: '#9A7B4F',
          600: '#7A623E',
        },
        primary: {
          50: '#E8F0ED',
          100: '#D3E2DC',
          200: '#A8C5BA',
          300: '#7AA394',
          400: '#4C8470',
          500: '#1F4A3E',
          600: '#1A3E34',
          700: '#153229',
          800: '#102820',
          900: '#0B1C16',
        },
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          'white-md': 'rgba(255, 255, 255, 0.2)',
          'white-lg': 'rgba(255, 255, 255, 0.3)',
          dark: 'rgba(0, 0, 0, 0.1)',
          'dark-md': 'rgba(0, 0, 0, 0.2)',
          'dark-lg': 'rgba(0, 0, 0, 0.3)',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
        'neumorphic': '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
        'neumorphic-inset': 'inset 8px 8px 16px rgba(163, 177, 198, 0.6), inset -8px -8px 16px rgba(255, 255, 255, 0.5)',
        'glow': '0 0 20px rgba(31, 74, 62, 0.25)',
        'glow-sm': '0 0 10px rgba(31, 74, 62, 0.18)',
        'folio': '0 24px 60px -28px rgba(28, 25, 22, 0.28)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'scroll-left': 'scrollLeft 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(31, 74, 62, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(31, 74, 62, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
