import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import typeography from "@tailwindcss/typography"

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [typeography, daisyui],
};
export default config;
