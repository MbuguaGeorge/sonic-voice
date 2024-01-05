import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '0%' : {
            transform: 'scale(.9)'
          },
          '70%' : {
            transform: 'scale(1)',
            boxShadow: '0 0 0 50px rgba(90, 153, 212, 0)'
          },
          '100%' : {
            transform: 'scale(.9)',
            boxShadow: '0 0 0 0 rgba(90, 153, 212, 0)'
          }
        }
      },
      animation: {
        pulse: 'pulse 1.5s infinite',
      }
    },
  },
  plugins: [],
}
export default config
