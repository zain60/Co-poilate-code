/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      smm: { raw: '(max-width: 479px)' }, // very small mobile (special case)
      sm: '480px',       // small phones and up
      md: '768px',       // tablets and up
      lg: '1025px',      // small desktops and up
      xl: '1291px',      // large desktops and up
      xxl: '1561px',     // larger
      '3xl': '1921px',   // ultra-wide screens
    },
    
    extend: {},
  },
  plugins: [],
};
