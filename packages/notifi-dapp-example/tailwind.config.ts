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
    extend: {
      width: {
        86: '343px',
        112: '445px',
        18: '70px',
        90: '360px',
      },
      maxWidth: {
        148: '37rem' /* 592px */,
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
          'primary-text': 'rgb(var(--notifi-primary-text))',
          'button-primary-bg': 'rgb(var(--notifi-button-primary-bg))',
          'button-primary-blueish-bg':
            'rgb(var(--notifi-button-primary-blueish-bg))',
          'button-primary-text': 'rgb(var(--notifi-button-primary-text))',
          'button-hover-bg': 'rgb(var(--notifi-button-hover-bg))',
          'label-connect-wallet-text':
            'rgb(var(--notifi-label-connect-wallet-text))',
          'container-bg': 'rgb(var( --notifi-bgimg-left))',
          'card-bg': 'rgb(var(--notifi-card-bg))',
          'destination-card-text': 'rgb(var(--notifi-destination-card-text))',
          'toggle-on-bg': 'rgb(var(--notifi-toggle-on-bg))',
          'toggle-off-bg': 'rgb(var(--notifi-toggle-off-bg))',
          success: 'rgb(var(--notifi-success))',
          error: 'rgb(var(--notifi-error))',
          'icon-selected': 'rgb(var(--notifi-icon-selected))',
          'icon-unselected': 'rgb(var(--notifi-icon-unselected))',
          'tab-unselected-text': 'rgb(var(--notifi-tab-unselected-text))',
          'alert-subscription-block-bg':
            'rgb(var(--notifi-alert-subscription-block-bg))',
          'text-light': 'rgb(var(--notifi-text-light))',
          'text-medium': 'rgb(var(--notifi-text-medium))',
          'toggle-off-dot-bg': 'rgb(var(--notifi-toggle-off-dot-bg))',
        },
      },
      backgroundImage: {
        'gradient-notifi': `linear-gradient(107deg, rgb(var(--notifi-bgimg-left)) 1.37%, rgb(var(--notifi-bgimg-middle)) 47.55%, rgb(var(--notifi-bgimg-right)) 103.36%)`,
        'gradient-injective': `linear-gradient(180deg, #E4F7FC 0%, #F5F9FD 49.67%, #EFEFFD 100%)`,
        'radial-gradient-red':
          'radial-gradient(rgba(249, 201, 221, 1), white 95%);',
        'radial-gradient-orange':
          'radial-gradient(rgba(252, 232, 201, 1), white 95%);',
        'radial-gradient-green':
          'radial-gradient(rgba(201, 252, 206, 1), white 95%);',
        'radial-gradient-blue':
          'radial-gradient(rgba(220, 222, 255, 1), white 95%);',
      },
    },
  },
  plugins: [],
};
export default config;
