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
    description: 'See your activity and gain access to alerts',
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
    emailVerifyMessage: 'We’ve sent a verification email to:',
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
};

export const validationRegex: Record<string, RegExp> = {
  email: new RegExp('^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'),
};

export const defaultLoadingAnimationStyle: Record<string, React.CSSProperties> =
  {
    spinner: {
      borderTop: '4px var(--notifi-color-seaglass-dark) solid', // TODO: TBD see if dark/light mode needed?
      position: 'absolute',
    },
  };
