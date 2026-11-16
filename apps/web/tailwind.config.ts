import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        nsu: {
          canvas: '#F8FAFC',
          canvasAlt: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
          navy: '#0F2942',
          navyDark: '#0A1C2E',
          navyLight: '#0B3B59',
          teal: '#0D7A91',
          tealLight: '#0891B2',
          emerald: '#10B981',
          emeraldLight: '#ECFDF5',
          emeraldDark: '#065F46',
          amber: '#F59E0B',
          amberLight: '#FFFBEB',
          amberDark: '#92400E',
          crimson: '#DC2626',
          crimsonLight: '#FEF2F2',
          crimsonDark: '#991B1B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
