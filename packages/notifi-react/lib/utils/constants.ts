import { Target } from '../context';

export const defaultCopy = {
  connect: {
    title: 'Notifications',
    description: 'See your activity and gain access to alerts',
    buttonText: 'Next',
  },
  ftuAlertList: {
    title: 'Notifications',
    description: 'See your activity and gain access to alerts',
    buttonText: 'Next',
  },
  poweredByNotifi: 'Powered by',
  inputFields: {
    email: 'Email address',
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
    emailVerifyMessage: 'We’ve sent a verification email to:',
    emailCtaCalledSuccessfullyText: 'Email sent',
    discordVerifiedMessage: 'Make sure Discord DMs are enabled',
    discordVerifiedPromptTooltip:
      'Make sure you have enabled DMs in Discord. Right click on the server after joining, go to Privacy Settings, and enable Direct Messages.',
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
      text: 'Get alerts via',
      cta: 'Sign Up',
    },
  },
  inboxConfigTargetList: {
    header: 'Manage Destinations',
    buttonText: 'Edit Destinations',
  },
  inboxConfigTargetEdit: {
    header: 'Edit Destinations',
    buttonTextHasTarget: 'Save Changes',
    buttonTextNoTarget: 'Subscribe',
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

// TODO: Move this to utils (Maybe target.ts)
export const validationRegex: Record<string, RegExp> = {
  email: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
  telegram: new RegExp('.{5,}'),
};

export const defaultLoadingAnimationStyle: Record<string, React.CSSProperties> =
  {
    spinner: {
      borderTop: '4px var(--notifi-color-seaglass-dark) solid', // TODO: TBD see if dark/light mode needed?
      position: 'absolute',
    },
  };
