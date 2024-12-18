import { Target } from '../context';

export const defaultCopy = {
  connect: {
    title: 'Notifications',
    description: 'See your activity and gain access to alerts',
    hardwareWalletLabel: 'Use Hardware Wallet',
    buttonText: 'Next',
  },
  poweredByNotifi: 'Powered by',
  inputFields: {
    email: 'Enter your email address',
    phoneNumber: 'Phone Number',
    telegram: 'Telegram ID',
  },
  inputToggles: {
    discord: 'Discord DM Bot',
    slack: 'Slack',
    wallet: 'Wallet Alerts',
    discordUnavailable: 'Discord unavailable',
    slackUnavailable: 'Slack unavailable',
    walletUnavailable: 'Only available for Coinbase Wallet',
  },
  ftu: {
    headerTitles: {
      ftuTargetEdit: 'How do you want to be notified?',
      ftuAlertEdit: 'Select alerts',
    },
  },
  ftuTargetEdit: {
    description: 'Select a minimum of one destination',
    headerTitle: 'How do you want to be notified?',
    buttonText: 'Next',
  },
  ftuTargetList: {
    headerTitle: 'Verify your destinations',
    buttonText: 'Next',
  },
  ftuAlertEdit: {
    headerTitle: 'Select alerts',
    buttonText: 'Done',
  },
  targetList: {
    email: 'Email',
    phoneNumber: 'SMS',
    telegram: 'Telegram',
    discord: 'Discord',
    slack: 'Slack',
    wallet: 'Wallets',
    emailVerifyMessage: 'Verification email sent',
    discordVerifiedMessage: 'Make sure Discord DMs are enabled',
    discordVerifiedPromptTooltip:
      'Make sure you have enabled DMs in Discord. Right click on the server after joining, go to Privacy Settings, and enable Direct Messages.',
    walletVerifyMessage: '2-3 signatures required to verify',
    walletVerifyTooltip:
      'Wallet messages are powered by XMTP and delivered natively into Coinbase Wallet. Download the Coinbase Wallet App.',
    walletVerifiedMessage: 'Enable messages in Coinbase Wallet App',
    walletVerifiedTooltip:
      'Make sure messages are enabled in your Coinbase Wallet Mobile App.',
    walletVerifiedTooltipLink: {
      text: 'More info',
      url: 'https://docs.notifi.network/docs/target-setup/wallet-integration',
    },
  },
  topicOptions: {
    customInputPlaceholder: 'Custom',
  },
  subscriptionValueInput: {
    dropdownPlaceholder: '--- Select one option ---',
  },
  topicStackRowInput: {
    buttonContent: 'Save',
  },
  topicStackRow: {
    cta: '+ Add',
  },
  historyRow: {
    legacyTopic: 'Legacy: topic is removed',
  },
  inboxHistoryList: {
    headerTitle: 'Notifications',
    buttonText: 'Load More',
  },
  inboxHistoryDetail: {
    headerTitle: '',
  },
  historyList: {
    inboxEmptyTitle: 'Inbox empty',
    inboxEmptyDescription: `You haven’t received any notifications yet. You can manage your
    destinations and alerts under settings.`,
  },
  inboxConfigTopic: {
    header: 'Manage Notifications',
    title: 'Manage the alerts you want to receive:',
  },
  targetStateBanner: {
    verify: {
      title: 'Manage alert destinations',
      description: 'You have unverified destinations',
    },
    verifyInHistory: {
      title: 'Verify your',
      ctaText: 'Verify',
    },
    Signup: {
      textInHistory: 'Get alerts via',
      ctaInHistory: 'Sign Up',
      textInConfig: 'Get notifications to the destinations of your choice.',
    },
  },
  inboxConfigTargetList: {
    header: 'Manage Destinations',
    buttonText: 'Edit Destinations',
  },
  errorGlobal: {
    header: 'An error occurred',
    title: 'Something went wrong, please try again: ',
    detail: 'Contact support if the issue persists',
  },
  targetInputField: {
    inValidErrorMessage: (target: Target) =>
      `Please enter a valid ${target} address`,
  },
};
