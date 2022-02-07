module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        pop: "pop 100ms",
        shake: "shake 600ms",
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
      },
    },
  },
  plugins: [],
};
