import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
 
    },
      keyframes: {
            shimmer: {
              "0%, 90%, 100%": {
                "background-position": "calc(-100% - var(--shimmer-width)) 0",
              },
              "30%, 60%": {
                "background-position": "calc(100% + var(--shimmer-width)) 0",
              },
            },
            "spin-around": {
              "0%": {
                transform: "translateZ(0) rotate(0)",
              },
              "15%, 35%": {
                transform: "translateZ(0) rotate(90deg)",
              },
              "65%, 85%": {
                transform: "translateZ(0) rotate(270deg)",
              },
              "100%": {
                transform: "translateZ(0) rotate(360deg)",
              },
            },
            slide: {
              to: {
                transform: "translate(calc(100cqw - 100%), 0)",
              },
            },
          },  
          animation: {
            shimmer: "shimmer 8s infinite",
              "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
              slide: "slide var(--speed) ease-in-out infinite alternate",
          },
      
},
  plugins: [require("tailwindcss-animate")],
};
export default config;
