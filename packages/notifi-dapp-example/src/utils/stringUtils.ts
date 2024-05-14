export function formatTelegramForSubscription(telegramId: string) {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function convertWalletName(walletName: string) {
  switch (walletName) {
    case 'metamask':
      return 'MetaMask';
    case 'keplr':
      return 'Keplr';
    case 'leap':
      return 'Leap Wallet';
    case 'phantom':
      return 'Phantom';
    case 'coinbase':
      return 'Coinbase Wallet';
    case 'rabby':
      return 'Rabby';
    case 'rainbow':
      return 'Rainbow';
    case 'zerion':
      return 'Zerion';
    case 'okx':
      return 'OKX';
    case 'walletconnect':
      return 'Wallet Connect';
    case 'binance':
      return 'Binance';
    default:
      return walletName;
  }
}
