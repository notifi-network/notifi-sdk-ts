import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      rota: ['var(--font-rota)'],
    },
    extend: {
      backgroundImage: {
        // 'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        // 'gradient-conic':
        //   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-injective': `linear-gradient(107deg, rgba(238, 243, 250, 0.50) 1.37%, rgba(225, 235, 248, 0.50) 47.55%, rgba(198, 233, 245, 0.50) 103.36%)`,
      },
    },
  },
  plugins: [],
};
export default config;
