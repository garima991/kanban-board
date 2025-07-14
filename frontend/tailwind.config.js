/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Poppins', 'sans-serif'], // Custom font
      },
    },
     screens: {
      'xs': '375px',     // Extra small devices (custom), Applies at 375px and up
      sm: '640px',     // Small devices (default)
      md: '768px',     // Medium devices (default)
      lg: '1024px',    // Large devices (default)
      xl: '1280px',    // Extra large devices (default)
      '2xl': '1536px', // 2x large (default)
      '3xl': '1920px', // Ultra-wide (custom)
    },
  },
  plugins: [],
}