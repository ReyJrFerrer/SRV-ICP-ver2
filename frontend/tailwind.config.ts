import type { Config } from "tailwindcss";
const { fontFamily } = require('tailwindcss/defaultTheme'); 

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nordique Pro', ...fontFamily.sans],
      },
      colors: {
        yellow: {
            '50': '#fefce8',
            '100': '#fef9c3',
            '200': '#fef08a',
            '300': '#fde047', 
            '400': '#facc15', 
        },
        blue: {
            '50': '#eff6ff',
            '100': '#dbeafe',
            '600': '#2563eb', 
            '700': '#1d4ed8', 
        },
        slate: {
            '700': '#334155', 
            '800': '#1e293b', 
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;