/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a',
          900: '#1a2555',
        },
        sidebar: '#0b1220',
        card: {
          DEFAULT: 'rgba(255,255,255,0.02)'
        },
        brand: {
          50: '#e6fffa',
          100: '#bffaf0',
          400: '#34d399',
          500: '#10b981',
          600: '#059669'
        },
        accent: {
          blue: '#60a5fa',
          teal: '#2dd4bf',
          pink: '#f472b6',
          purple: '#7c3aed'
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
      }
    },
  },
  plugins: [],
}