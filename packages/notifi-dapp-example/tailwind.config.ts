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
        destinationCard: '0px 5px 20px 0px rgba(0, 0, 0, 0.07)',
        card: '10px 40px 100px 0px rgba(43, 64, 117, 0.1)',
      },
      colors: {
        notifi: {
          'primary-text': 'rgb(var(--notifi-primary-text))',
          text: 'rgb(var(--notifi-text))',
          'grey-text': 'rgb(var(--notifi-grey-text))',
          'button-primary-bg': 'rgb(var(--notifi-button-primary-bg))',
          'button-primary-blueish-bg':
            'rgb(var(--notifi-button-primary-blueish-bg))',
          'button-primary-text': 'rgb(var(--notifi-button-primary-text))',
          'button-hover-bg': 'rgb(var(--notifi-button-hover-bg))',
          'label-connect-wallet-text':
            'rgb(var(--notifi-label-connect-wallet-text))',
          'container-bg': 'rgb(var( --notifi-bgimg-left))',
          'destination-card-bg': 'rgb(var(--notifi-destination-card-bg))',
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
          'back-button-hover-bg': 'rgb(var(--notifi-back-button-hover-bg))',
          'back-button-focus-bg': 'rgb(var(--notifi-back-button-focus-bg))',
          'tenant-brand-bg': 'rgb(var(--notifi-tenant-bg))',
          'card-bg': 'rgb(var(--notifi-card-bg))',
          'dummy-alert-card-bg': 'rgb(var(--notifi-dummy-alert-card-bg))',
          bg: 'rgb(var(--notifi-bg))',
          'card-border': 'rgb(var(--notifi-card-border))',
          'input-border': 'rgb(var(--notifi-input-border))',
          'destination-logo-card-bg':
            'rgb(var(--notifi-destination-logo-card-bg))',
          'wallet-menu-card-bg': 'rgb(var(--notifi-wallet-menu-card-bg))',
          'loading-skeloton-bg': 'rgb(var(--notifi-loading-skeleton-bg))',
          'solid-bg': 'rgb(var(--notifi-solid-bg))',
          'history-read-card-bg': 'rgb(var(--notifi-history-read-card-bg))',
          'history-unread-card-bg': 'rgb(var(--notifi-history-unread-card-bg))',
        },
      },
      backgroundImage: {
        'gradient-notifi': `linear-gradient(107deg, rgb(var(--notifi-bgimg-left)) 1.37%, rgb(var(--notifi-bgimg-middle)) 47.55%, rgb(var(--notifi-bgimg-right)) 103.36%)`,
        'gradient-gmx': `linear-gradient(167.22deg, #181B3D 0.22%, #2A505B 83.23%);`,
        'gradient-side-nav-card': `linear-gradient(90deg, #2C365C 0%, #184957 100%);`,
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
