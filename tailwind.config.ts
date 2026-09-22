import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: "#a44a39",
        claret: "#652f2d",
        parchment: "#dcc7a2",
        blushpaper: "#e6c0bc",
        walnut: "#24150f",
        forestshadow: "#120e0c",
      },
      boxShadow: {
        candle: "0 0 70px rgba(255, 186, 105, 0.22)",
        seal: "0 16px 30px rgba(0, 0, 0, 0.45), inset 0 4px 8px rgba(255,255,255,0.12)",
      },
      backgroundImage: {
        parchment:
          "radial-gradient(circle at top, rgba(255,245,220,0.45), transparent 38%), linear-gradient(145deg, rgba(92,58,35,0.15), rgba(255,255,255,0.18)), linear-gradient(180deg, #ecd8b6 0%, #d7c09b 100%)",
        blush:
          "radial-gradient(circle at top, rgba(255,255,255,0.45), transparent 35%), linear-gradient(180deg, #f0d4cf 0%, #e1b8b2 100%)",
        wood:
          "linear-gradient(90deg, rgba(255,255,255,0.02) 0 6%, rgba(0,0,0,0.12) 6% 12%, rgba(255,255,255,0.02) 12% 18%, rgba(0,0,0,0.14) 18% 24%, rgba(255,255,255,0.02) 24% 30%), linear-gradient(180deg, #2f1c14 0%, #1c120d 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
