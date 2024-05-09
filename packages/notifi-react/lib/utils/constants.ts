export const defaultCopy = {
  connect: {
    title: 'Connect your wallet to use notifications',
    content: '',
    buttonText: 'Connect to Wallet',
  },
  expiry: {
    title: 'Subscription Expiry',
    content: 'Your subscription has expired',
    buttonText: 'Connect to Wallet',
  },
  ftuAlertList: {
    title: 'Notifications',
    description:
      'See your activity and gain access to alerts. Push notifications are also available and optional.',
    buttonText: 'Next',
  },
  poweredByNotifi: 'Powered',
  inputFields: {
    email: 'Email address',
    phoneNumber: 'Phone Number',
    telegram: 'Telegram ID',
  },
  inputToggles: {
    discord: 'Discord DM Bot',
    slack: 'Slack',
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
};

export const validationRegex: Record<string, RegExp> = {
  email: new RegExp('^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'),
};
