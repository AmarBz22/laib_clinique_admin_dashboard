/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#FF5E7E',
        'light-pink': '#F9A8D4',
        'white': '#FFFFFF',
        'light-gray-bg': '#F5F5F5',
        'dark-gray-text': '#1F2937',
        'muted-gray-text': '#6B7280',
        'search-bg': '#E2E8F0',
      },
    },
  },
  plugins: [],
}