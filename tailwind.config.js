export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#09090b',
        panel: '#18181b',
        accent: '#ec4899', // Pink accent
        'accent-glow': 'rgba(236, 72, 153, 0.5)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
