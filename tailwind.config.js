/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0EBFF',
          100: '#E0D6FF',
          200: '#C2ADFF',
          300: '#A385FF',
          400: '#855CFF',
          500: '#6C47FF',
          600: '#5635CC',
          700: '#412899',
          800: '#2B1A66',
          900: '#160D33',
        },
        coral: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          200: '#FFC2C2',
          300: '#FFA3A3',
          400: '#FF8585',
          500: '#FF6B6B',
          600: '#CC5555',
          700: '#994040',
          800: '#662B2B',
          900: '#331515',
        },
        surface: {
          50: '#F8F9FF',
          100: '#F1F3FF',
          200: '#E8EBFF',
        },
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'input': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(108, 71, 255, 0.08), 0 4px 12px rgba(108, 71, 255, 0.04)',
        'card-hover': '0 4px 16px rgba(108, 71, 255, 0.12), 0 8px 24px rgba(108, 71, 255, 0.06)',
        'nav': '0 -1px 12px rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
