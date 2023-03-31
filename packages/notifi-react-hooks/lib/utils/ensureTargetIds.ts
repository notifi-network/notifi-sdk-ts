import {
  ClientCreateWebhookParams,
  CreateDiscordTargetService,
  CreateEmailTargetService,
  CreateSmsTargetService,
  CreateTelegramTargetService,
  CreateWebhookTargetService,
  DiscordTarget,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
  WebhookTarget,
} from '@notifi-network/notifi-core';

import {
  ensureDiscord,
  ensureEmail,
  ensureSms,
  ensureTelegram,
  ensureWebhook,
} from './ensureTarget';

export type ExistingData = Readonly<{
  emailTargets?: EmailTarget[];
  smsTargets?: SmsTarget[];
  telegramTargets?: TelegramTarget[];
  webhookTargets?: WebhookTarget[];
  discordTargets?: DiscordTarget[];
}>;

const ensureTargetIds = async (
  service: CreateEmailTargetService &
    CreateSmsTargetService &
    CreateTelegramTargetService &
    CreateWebhookTargetService &
    CreateDiscordTargetService,
  existing: ExistingData,
  input: Readonly<{
    emailAddress: string | null;
    phoneNumber: string | null;
    telegramId: string | null;
    webhook?: ClientCreateWebhookParams;
    discordId: string | null;
  }>,
) => {
  const { emailAddress, phoneNumber, telegramId, webhook, discordId } = input;

  const [
    emailTargetId,
    smsTargetId,
    telegramTargetId,
    webhookTargetId,
    discordTargetId,
  ] = await Promise.all([
    ensureEmail(service, existing.emailTargets, emailAddress),
    ensureSms(service, existing.smsTargets, phoneNumber),
    ensureTelegram(service, existing.telegramTargets, telegramId),
    ensureWebhook(service, existing.webhookTargets, webhook),
    ensureDiscord(service, existing.discordTargets, discordId),
  ]);

  const emailTargetIds = [];
  if (emailTargetId !== null) {
    emailTargetIds.push(emailTargetId);
  }

  const smsTargetIds = [];
  if (smsTargetId !== null) {
    smsTargetIds.push(smsTargetId);
  }

  const telegramTargetIds = [];
  if (telegramTargetId !== null) {
    telegramTargetIds.push(telegramTargetId);
  }

  const webhookTargetIds = [];
  if (webhookTargetId !== null) {
    webhookTargetIds.push(webhookTargetId);
  }

  const discordTargetIds = [];
  if (discordTargetId !== null) {
    discordTargetIds.push(discordTargetId);
  }

  return {
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    webhookTargetIds,
    discordTargetIds,
  };
};

export default ensureTargetIds;
