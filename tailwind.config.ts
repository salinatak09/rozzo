import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FCFAF6",
          100: "#F7F3EA",
          200: "#EFE8DA",
          300: "#E3D7C1",
          400: "#D3C2A3",
        },
        brand: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          500: "#16A34A",
          600: "#15803D",
          700: "#166534",
          800: "#14532D",
          900: "#0E3920",
        },
        terracotta: {
          50: "#FEF4F2",
          100: "#FCE7E4",
          500: "#C84B31",
          600: "#B03E26",
        },
        curry: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#D97706",
          600: "#B45309",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(44, 24, 16, 0.06)",
        warm: "0 8px 30px -4px rgba(66, 40, 20, 0.08)",
        floating: "0 14px 40px -6px rgba(22, 101, 52, 0.18)",
      }
    },
  },
  plugins: [],
};
export default config;
