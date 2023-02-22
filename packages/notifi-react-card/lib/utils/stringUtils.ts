export function addressEllipsis(
  str: string | undefined,
  index?: number,
): string | undefined {
  index = index || 6;

  if (!str || str.length < 11) {
    return str;
  }

  return str.slice(0, index) + '...' + str.slice(str.length - index);
}

export function formatTelegramForSubscription(telegramId: string) {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
}

export function prefixCharacter(value: string, character: string) {
  return character + value;
}

export function prefixTelegramWithSymbol(telegramId: string) {
  if (telegramId.startsWith('@')) {
    return telegramId;
  }
  return prefixCharacter(telegramId, '@');
}
