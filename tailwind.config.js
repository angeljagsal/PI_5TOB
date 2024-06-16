/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./www/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        'inner-light': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
        'inner-strong': 'inset 0 2px 4px rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
}

