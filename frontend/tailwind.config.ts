import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080B11",
        surface: "#0F1623",
        "surface-card": "rgba(18, 26, 41, 0.75)",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        saffron: {
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          glow: "#FF6B00",
        },
        gold: {
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
        },
        tiranga: {
          saffron: "#FF671F",
          white: "#FFFFFF",
          green: "#046A38",
          navy: "#06038D",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        indic: ["Noto Sans Devanagari", "Noto Sans Bengali", "sans-serif"],
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at 50% 20%, rgba(255, 107, 0, 0.15), transparent 70%)",
        "card-gradient": "linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)",
        "gold-gradient": "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #92400E 100%)",
      },
      boxShadow: {
        "saffron-glow": "0 0 25px -5px rgba(255, 107, 0, 0.3)",
        "gold-glow": "0 0 30px -5px rgba(234, 179, 8, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
