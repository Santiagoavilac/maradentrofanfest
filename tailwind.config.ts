import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        lagoon: "#36d7d0",
        deep: "#061525",
        pitch: "#42d27a",
        sand: "#f4c967",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(54, 215, 208, 0.24)",
        gold: "0 18px 60px rgba(244, 201, 103, 0.22)",
      },
    },
  },
  plugins: [],
} satisfies Config;
