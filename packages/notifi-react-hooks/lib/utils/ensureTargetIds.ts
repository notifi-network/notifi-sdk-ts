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
  Web3Target,
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
  web3Targets?: Web3Target[];
}>;

const ensureTargetIds = async (
  service: CreateEmailTargetService &
    CreateSmsTargetService &
    CreateTelegramTargetService &
    CreateWebhookTargetService &
    CreateDiscordTargetService &
    CreateWeb3TargetService,
  existing: ExistingData,
  input: Readonly<{
    emailAddress: string | undefined;
    phoneNumber: string | undefined;
    telegramId: string | undefined;
    webhook?: ClientCreateWebhookParams;
    discordId: string | undefined;
    web3TargetId: string | undefined;
  }>,
) => {
  const { emailAddress, phoneNumber, telegramId, webhook, discordId } = input;

  const [
    emailTargetId,
    smsTargetId,
    telegramTargetId,
    webhookTargetId,
    discordTargetId,
    web3TargetId,
  ] = await Promise.all([
    ensureEmail(service, existing.emailTargets, emailAddress),
    ensureSms(service, existing.smsTargets, phoneNumber),
    ensureTelegram(service, existing.telegramTargets, telegramId),
    ensureWebhook(service, existing.webhookTargets, webhook),
    ensureDiscord(service, existing.discordTargets, discordId),
    ensureWeb3(service, existing.web3Targets, web3TargetId),
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
  const web3TargetIds = [];
  if (web3TargetId !== null) {
    web3TargetId.push(discordTargetId);
  }

  return {
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    webhookTargetIds,
    discordTargetIds,
    web3TargetIds,
  };
};

export default ensureTargetIds;
