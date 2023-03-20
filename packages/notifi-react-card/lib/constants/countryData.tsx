export type CountryMap = typeof countryMap;

export type DialCode = keyof CountryMap;
export type CountryMetadata = CountryMap[keyof CountryMap];

export const countryMap = {
  '+1': {
    dialCode: '+1',
    flag: '🇺🇸',
    name: 'United States/Canada',
  },
  '+61': {
    dialCode: '+61',
    flag: '🇦🇺',
    name: 'Australia',
  },
  '+43': {
    dialCode: '+43',
    flag: '🇦🇹',
    name: 'Austria',
  },
  '+32': {
    dialCode: '+32',
    flag: '🇧🇪',
    name: 'Belgium',
  },
  '+55': {
    dialCode: '+55',
    flag: '🇧🇷',
    name: 'Brazil',
  },
  '+45': {
    dialCode: '+45',
    flag: '🇩🇰',
    name: 'Denmark',
  },
  '+358': {
    dialCode: '+358',
    flag: '🇫🇮',
    name: 'Finland',
  },
  '+33': {
    dialCode: '+33',
    flag: '🇫🇷',
    name: 'France',
  },
  '+49': {
    dialCode: '+49',
    flag: '🇩🇪',
    name: 'Germany',
  },
  '+852': {
    dialCode: '+852',
    flag: '🇭🇰',
    name: 'Hong Kong',
  },
  '+36': {
    dialCode: '+36',
    flag: '🇭🇺',
    name: 'Hungary',
  },
  '+354': {
    dialCode: '+354',
    flag: '🇮🇸',
    name: 'Iceland',
  },
  '+60': {
    dialCode: '+60',
    flag: '🇲🇾',
    name: 'Malaysia',
  },
  '+47': {
    dialCode: '+47',
    flag: '🇳🇴',
    name: 'Norway',
  },
  '+63': {
    dialCode: '+63',
    flag: '🇵🇭',
    name: 'Philippines',
  },
  '+48': {
    dialCode: '+48',
    flag: '🇵🇱',
    name: 'Poland',
  },
  '+351': {
    dialCode: '+351',
    flag: '🇵🇹',
    name: 'Portugal',
  },
  '+65': {
    dialCode: '+65',
    flag: '🇸🇬',
    name: 'Singapore',
  },
  '+82': {
    dialCode: '+82',
    flag: '🇰🇷',
    name: 'Korea, Republic of South Korea',
  },
  '+34': {
    dialCode: '+34',
    flag: '🇪🇸',
    name: 'Spain',
  },
  '+46': {
    dialCode: '+46',
    flag: '🇸🇪',
    name: 'Sweden',
  },
  '+41': {
    dialCode: '+41',
    flag: '🇨🇭',
    name: 'Switzerland',
  },
  '+886': {
    dialCode: '+886',
    flag: '🇹🇼',
    name: 'Taiwan',
  },
  '+44': {
    dialCode: '+44',
    flag: '🇬🇧',
    name: 'United Kingdom',
  },
} as const;
