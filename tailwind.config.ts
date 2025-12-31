import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx,json}"],
  theme: {
    extend: {
      colors: { ink: "#05070A" }
    },
  },
  plugins: [typography],
} satisfies Config;
