import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ink: "#162033", navy: "#17243b", cream: "#f6f5f0", gator: "#e85c2b", blue: "#2366b1" },
      boxShadow: { card: "0 14px 40px rgba(30, 45, 70, .07)" }
    }
  },
  plugins: []
} satisfies Config;
