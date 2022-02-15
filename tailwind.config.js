module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        pop: "pop 100ms",
        shake: "shake 600ms",
        flipIn: "flipIn 250ms ease-in",
        flipOut: "flipOut 250ms ease-in",
        fade: "fade 250ms",
      },
      keyframes: {
        pop: {
          from: { transform: "scale(0.8)", opacity: 0 },
          "40%": { transform: "scale(1.1)", opacity: 1 },
        },
        shake: {
          "10%,90%": { transform: "translateX(-1px)" },
          "20%,80%": { transform: "translateX(1px)" },
          "30%,50%,70%": { transform: "translateX(-4px)" },
          "40%,60%": { transform: "translateX(4px)" },
        },
        flipIn: {
          "0%": { transform: "rotateX(0)" },
          "100%": { transform: "rotateX(-90deg)" },
        },
        flipOut: {
          "0%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0)" },
        },
        fade: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
