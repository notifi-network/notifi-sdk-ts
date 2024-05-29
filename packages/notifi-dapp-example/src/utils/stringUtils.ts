export function formatTelegramForSubscription(telegramId: string) {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPriceNumber = (num: number) => {
  const numberParts = num.toString().split('.');
  const decimals = numberParts[1] ? numberParts[1].length : 0;

  if (decimals === 0) {
    return Number(num)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  } else {
    return Number(num)
      .toFixed(decimals)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
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
