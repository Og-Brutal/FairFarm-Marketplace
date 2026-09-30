/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f0f5eb',
          100: '#e3edda',
          200: '#D1E2C4',
          300: '#b8d1a3',
          400: '#9abc82',
          500: '#7da863',
        },
        neutral: {
          warm: '#CFCECA',
          100: '#e8e7e5',
          200: '#CFCECA',
          300: '#b5b4b0',
        },
        rust: {
          50: '#f7ede8',
          100: '#e8c8bb',
          200: '#c47a62',
          300: '#a65638',
          400: '#853D25',
          500: '#6b3120',
          600: '#52261a',
        },
        olive: {
          50: '#eeedde',
          100: '#d4d3a9',
          200: '#8a8a4d',
          300: '#6e6e38',
          400: '#555424',
          500: '#3c3b1a',
          600: '#2a2912',
        },
        farm: {
          cream: '#faf8f5',
          sand: '#f2efe8',
          wheat: '#e8dcc8',
          soil: '#3d2c1e',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'field-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D1E2C4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
