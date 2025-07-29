/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        '70': '280px', // For sidebar width
      },
      margin: {
        '70': '280px', // For main content margin
      },
      colors: {
        green: {
          50: '#e4f5d5',
          100: '#e4f5d5',
          200: '#c4e4b5',
          800: '#0f5744',
        }
      }
    },
  },
  plugins: [],
} 