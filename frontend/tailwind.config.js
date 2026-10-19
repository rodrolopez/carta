/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'resto-dark': '#0d0d0d',    // Fondo principal casi negro
        'resto-black': '#000000',   // Negro puro para paneles
        'resto-red': '#db2721',     // Rojo basado en el logo "AQUI"
        'resto-orange': '#f97316',  // Naranja para acentos
        'resto-gray': '#2d2d2d',    // Gris oscuro para bordes y separadores
      }
    },
  },
  plugins: [],
}