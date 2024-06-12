/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./www/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        'inner-light': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',  // Más suave
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',        // Intensidad media
        'inner-strong': 'inset 0 2px 4px rgba(0, 0, 0, 0.25)' // Más pronunciada
      }
    },
  },
  plugins: [],
}

