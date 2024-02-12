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
      width: {
        86: '343px',
        112: '445px',
        18: '70px',
        90: '360px',
      },
      height: {
        18: '70px',
      },
      boxShadow: {
        container: '0px 10px 40px 0px #0000000D',
        card: '0px 2px 6px 0px #0000001A',
      },
      colors: {
        notifi: {
          // TODO: Temp bg color. TBD
          'page-bg': 'rgb(var(--notifi-page-bg))',
          'button-primary-bg': 'rgb(var(--notifi-button-primary-bg))',
          'button-primary-blueish-bg':
            'rgb(var(--notifi-button-primary-blueish-bg))',
          'button-primary-text': 'rgb(var(--notifi-button-primary-text))',
          'label-connect-wallet-text':
            'rgb(var(--notifi-label-connect-wallet-text))',
          'container-bg': 'rgb(var( --notifi-bgimg-left))',
          'card-bg': 'rgb(var(--notifi-card-bg))',
          dusk: 'rgb(128, 130, 157)',
          cyan: 'rgb(0, 203, 253)',
          heather: 'rgb(182, 184, 213)',
          success: 'rgb(7, 168, 37)',
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
