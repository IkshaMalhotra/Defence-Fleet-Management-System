/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          50: '#f4f6f5',
          100: '#e3e8e5',
          200: '#c7d1cc',
          300: '#a1b0aa',
          400: '#7a8d85',
          500: '#5f716b',
          600: '#4a5955',
          700: '#3d4a46',
          800: '#333d3a',
          900: '#2d3532',
          950: '#1a1f1d',
        },
        olive: {
          50: '#f6f7f4',
          100: '#e9ebe4',
          200: '#d4d8ca',
          300: '#b5bca6',
          400: '#939d7f',
          500: '#798463',
          600: '#5f6a4e',
          700: '#4b5340',
          800: '#3e4436',
          900: '#363b30',
          950: '#1c1f18',
        },
        accent: {
          amber: '#d97706',
          red: '#dc2626',
          green: '#16a34a',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}