/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",],
  theme: {
    extend: {
      colors:{
        'primary-color':'#0D120B',
        'primary-color-2':'#0F2923',
        'secondary-color': '#54CC94',
        'tertiary-color': '#047B62',
        'tertiary-color-2': '#8DB9B0',
      },
      backgroundImage:{
        'hero-section': "url('./assets/images/Hero section image.png')",
        'mission-section': "url('./assets/images/Mission.png')",
        'frame-1': "url('./assets/images/Frame-1.png')",
        'frame-2': "url('./assets/images/Frame-2.png')",
        'frame-3': "url('./assets/images/Frame-3.png')",
      },
      animation: {
        'slide': 'slide 50s linear infinite',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateXY(0px 25px)'},
          '100%': { transform: 'translateX(-100%)'},
        }
      }
    },
  },
  plugins: [],
}
