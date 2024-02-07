import type { Config } from 'tailwindcss';

const config: Config = {
  purge: {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    options: {
      safelist: ['html', 'body'],
    },
  },
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
      colors: {
        notifi: {
          // TODO: Temp bg color. TBD
          'page-bg': 'rgb(var(--notifi-page-bg))',
          'button-primary-bg': 'rgb(var(--notifi-button-primary-bg))',
          'button-primary-text': 'rgb(var(--notifi-button-primary-text))',
          'label-connect-wallet-text':
            'rgb(var(--notifi-label-connect-wallet-text))',
        },
      },
      backgroundImage: {
        'gradient-notifi': `linear-gradient(107deg, rgb(var(--notifi-bgimg-left)) 1.37%, rgb(var(--notifi-bgimg-middle)) 47.55%, rgb(var(--notifi-bgimg-right)) 103.36%)`,
      },
    },
  },
  plugins: [],
};
export default config;
