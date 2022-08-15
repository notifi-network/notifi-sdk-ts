import {
  CreateEmailTargetService,
  CreateSmsTargetService,
  CreateTelegramTargetService,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
} from '@notifi-network/notifi-core';

export type CreateFunc<Service, T> = (
  service: Service,
  value: string,
) => Promise<T>;
export type IdentifyFunc<T> = (arg: T) => string | null;
export type ValueTransformFunc = (value: string) => string;

const ensureTarget = <Service, T extends Readonly<{ id: string | null }>>(
  create: CreateFunc<Service, T>,
  identify: IdentifyFunc<T>,
  valueTransform?: ValueTransformFunc,
): ((
  service: Service,
  existing: Array<T> | undefined,
  value: string | null,
) => Promise<string | null>) => {
  return async (service, existing, value) => {
    if (value === null) {
      return null;
    }

    const transformedValue =
      valueTransform !== undefined ? valueTransform(value) : value;

    const found = existing?.find((it) => identify(it) === transformedValue);

    if (found !== undefined) {
      return found.id;
    }

    const created = await create(service, transformedValue);
    existing?.push(created);
    return created.id;
  };
};

const ensureEmail = ensureTarget(
  async (service: CreateEmailTargetService, value: string) =>
    await service.createEmailTarget({
      name: value.toLowerCase(),
      value: value.toLowerCase(),
    }),
  (arg: EmailTarget) => arg.emailAddress?.toLowerCase() ?? null,
  (value: string) => value.toLowerCase(),
);

const ensureSms = ensureTarget(
  async (service: CreateSmsTargetService, value: string) =>
    await service.createSmsTarget({
      name: value,
      value,
    }),
  (arg: SmsTarget) => arg.phoneNumber,
);

const ensureTelegram = ensureTarget(
  async (service: CreateTelegramTargetService, value: string) =>
    await service.createTelegramTarget({
      name: value.toLowerCase(),
      value: value.toLowerCase(),
    }),
  (arg: TelegramTarget) => arg.telegramId?.toLowerCase() ?? null,
  (value) => value.toLowerCase(),
);

const ensureWebhook = ensureTarget(
  async (service: CreateWebhookTargetService, value: string) =>
    await service.createWebhookTarget({
      name: value.toLowerCase(),
      value: value.toLowerCase(),
    }),
  (arg: WebhookTarget) => arg.telegramId?.toLowerCase() ?? null,
  (value) => value.toLowerCase(),
);

export { ensureEmail, ensureSms, ensureTelegram, ensureWebhook };

export default ensureTarget;
