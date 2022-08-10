import {
  CreateEmailTargetService,
  CreateSmsTargetService,
  CreateTelegramTargetService,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
} from '@notifi-network/notifi-core';

import { ensureEmail, ensureSms, ensureTelegram } from './ensureTarget';

export type ExistingData = Readonly<{
  emailTargets?: EmailTarget[];
  smsTargets?: SmsTarget[];
  telegramTargets?: TelegramTarget[];
}>;

const ensureTargetIds = async (
  service: CreateEmailTargetService &
    CreateSmsTargetService &
    CreateTelegramTargetService,
  existing: ExistingData,
  input: Readonly<{
    emailAddress: string | null;
    phoneNumber: string | null;
    telegramId: string | null;
  }>,
) => {
  const { emailAddress, phoneNumber, telegramId } = input;
  const [emailTargetId, smsTargetId, telegramTargetId] = await Promise.all([
    ensureEmail(service, existing.emailTargets, emailAddress),
    ensureSms(service, existing.smsTargets, phoneNumber),
    ensureTelegram(service, existing.telegramTargets, telegramId),
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
  return { emailTargetIds, smsTargetIds, telegramTargetIds };
};

export default ensureTargetIds;
