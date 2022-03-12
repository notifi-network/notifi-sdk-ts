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

const ensureTarget = <Service, T extends Readonly<{ id: string | null }>>(
  create: CreateFunc<Service, T>,
  identify: IdentifyFunc<T>,
): ((
  service: Service,
  existing: Array<T> | undefined,
  value: string | null,
) => Promise<string | null>) => {
  return async (service, existing, value) => {
    if (value === null) {
      return null;
    }

    const found = existing?.find((it) => identify(it) === value);

    if (found !== undefined) {
      return found.id;
    }

    const created = await create(service, value);
    existing?.push(created);
    return created.id;
  };
};

const ensureEmail = ensureTarget(
  async (service: CreateEmailTargetService, value: string) =>
    await service.createEmailTarget({
      name: value,
      value,
    }),
  (arg: EmailTarget) => arg.emailAddress,
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
      name: value,
      value,
    }),
  (arg: TelegramTarget) => arg.telegramId,
);

export { ensureEmail, ensureSms, ensureTelegram };

export default ensureTarget;
