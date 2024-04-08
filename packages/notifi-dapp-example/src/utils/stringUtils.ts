export function formatTelegramForSubscription(telegramId: string) {
  if (telegramId.startsWith('@')) {
    return telegramId.slice(1);
  }
  return telegramId;
}
