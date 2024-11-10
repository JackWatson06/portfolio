import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [daisyui],
};
export default config;
