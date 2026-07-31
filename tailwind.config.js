/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#7A1930",
          dark: "#4E0F1F",
          light: "#9C2A44",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C97A",
          dark: "#9C7C31",
        },
        ivory: "#FBF7EF",
        ink: "#241014",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["Poppins", "sans-serif"],
        deva: ["'Noto Serif Telugu'", "serif"],
      },
      keyframes: {
        fadeSlideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        cardReveal: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceDot: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
      },
      animation: {
        fadeSlideDown: "fadeSlideDown 0.8s ease-out both",
        fadeIn: "fadeIn 1s ease-out both",
        cardReveal: "cardReveal 1s cubic-bezier(0.22,1,0.36,1) both",
        bounceDot: "bounceDot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
