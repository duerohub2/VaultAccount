import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: { extend: {
    colors: { bg: "#F5F0E8", card: "#FFFFFF", ink: "#0A0A0A", inkSoft: "#4A4A4A", accent: "#FFD93D", accent2: "#FF6B35", green: "#00C853", red: "#FF3B30", blue: "#2979FF" },
    fontFamily: { display: ["var(--font-display)", "sans-serif"], body: ["var(--font-body)", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
