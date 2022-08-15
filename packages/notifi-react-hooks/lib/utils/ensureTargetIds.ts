import {
  ensureEmail,
  ensureSms,
  ensureTelegram,
  ensureWebhook,
} from './ensureTarget';
import {
  ClientCreateWebhookParams,
  CreateEmailTargetService,
  CreateSmsTargetService,
  CreateTelegramTargetService,
  CreateWebhookTargetService,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
  WebhookTarget,
} from '@notifi-network/notifi-core';

export type ExistingData = Readonly<{
  emailTargets?: EmailTarget[];
  smsTargets?: SmsTarget[];
  telegramTargets?: TelegramTarget[];
  webhookTargets?: WebhookTarget[];
}>;

const ensureTargetIds = async (
  service: CreateEmailTargetService &
    CreateSmsTargetService &
    CreateTelegramTargetService &
    CreateWebhookTargetService,
  existing: ExistingData,
  input: Readonly<{
    emailAddress: string | null;
    phoneNumber: string | null;
    telegramId: string | null;
    webhook?: ClientCreateWebhookParams;
  }>,
) => {
  const { emailAddress, phoneNumber, telegramId, webhook } = input;
  const [emailTargetId, smsTargetId, telegramTargetId, webhookTargetId] =
    await Promise.all([
      ensureEmail(service, existing.emailTargets, emailAddress),
      ensureSms(service, existing.smsTargets, phoneNumber),
      ensureTelegram(service, existing.telegramTargets, telegramId),
      ensureWebhook(service, existing.webhookTargets, webhook),
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

  return { emailTargetIds, smsTargetIds, telegramTargetIds, webhookTargetIds };
};

export default ensureTargetIds;
