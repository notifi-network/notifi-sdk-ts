import type { Operations, Types } from '@notifi-network/notifi-graphql';

export type CreateFunc<CreateService, T> = (
  service: CreateService,
  value: string,
) => Promise<T>;
export type FetchFunc<GetService, T> = (
  service: GetService,
) => Promise<Array<T | undefined> | undefined>;
export type IdentifyFunc<T> = (arg: T | undefined) => string | undefined;
export type ValueTransformFunc = (value: string) => string;

export const ensureTarget = <
  CreateService,
  GetService,
  T extends Readonly<{ id: string }>,
>(
  create: CreateFunc<CreateService, T>,
  fetch: FetchFunc<GetService, T>,
  identify: IdentifyFunc<T>,
  valueTransform?: ValueTransformFunc,
): ((
  service: CreateService & GetService,
  value: string | undefined,
) => Promise<string | undefined>) => {
  return async (service, value) => {
    if (value === undefined) {
      return undefined;
    }

    const existing = await fetch(service);

    const transformedValue =
      valueTransform !== undefined ? valueTransform(value) : value;

    const found = existing?.find((it) => identify(it) === transformedValue);

    if (found !== undefined) {
      return found.id;
    }

    const created = await create(service, transformedValue);
    return created.id;
  };
};

export const ensureEmail = ensureTarget(
  async (service: Operations.CreateEmailTargetService, value: string) => {
    const mutation = await service.createEmailTarget({
      name: value.toLowerCase(),
      value: value.toLowerCase(),
    });

    const result = mutation.createEmailTarget;
    if (result === undefined) {
      throw new Error('Failed to create email target');
    }

    return result;
  },
  async (service: Operations.GetEmailTargetsService) => {
    const query = await service.getEmailTargets({});
    return query.emailTarget;
  },
  (arg: Types.EmailTargetFragmentFragment | undefined) =>
    arg?.emailAddress?.toLowerCase(),
  (value: string) => value.toLowerCase(),
);

export const ensureSms = ensureTarget(
  async (service: Operations.CreateSmsTargetService, value: string) => {
    const mutation = await service.createSmsTarget({
      name: value,
      value,
    });

    const result = mutation.createSmsTarget;
    if (result === undefined) {
      throw new Error('Failed to create sms target');
    }

    return result;
  },
  async (service: Operations.GetSmsTargetsService) => {
    const query = await service.getSmsTargets({});
    return query.smsTarget;
  },
  (arg: Types.SmsTargetFragmentFragment | undefined) => arg?.phoneNumber,
);

export const ensureTelegram = ensureTarget(
  async (service: Operations.CreateTelegramTargetService, value: string) => {
    const mutation = await service.createTelegramTarget({
      name: value.toLowerCase(),
      value: value.toLowerCase(),
    });

    const result = mutation.createTelegramTarget;
    if (result === undefined) {
      throw new Error('Failed to create telegramTarget');
    }

    return result;
  },
  async (service: Operations.GetTelegramTargetsService) => {
    const query = await service.getTelegramTargets({});
    return query.telegramTarget;
  },
  (arg: Types.TelegramTargetFragmentFragment | undefined) =>
    arg?.telegramId?.toLowerCase(),
  (value) => value.toLowerCase(),
);

export const ensureDiscord = ensureTarget(
  async (service: Operations.CreateDiscordTargetService, value: string) => {
    const mutation = await service.createDiscordTarget({
      name: value,
      value,
    });

    const result = mutation.createDiscordTarget;
    if (result === undefined) {
      throw new Error('Failed to create discordTarget');
    }

    return result;
  },

  async (service: Operations.GetDiscordTargetsService) => {
    const query = await service.getDiscordTargets({});
    return query.discordTarget;
  },
  (arg: Types.DiscordTargetFragmentFragment | undefined) => arg?.name,
  () => 'Default',
);

export type EnsureWebhookParams = Omit<
  Types.CreateWebhookTargetMutationVariables,
  'name'
>;

// Webhook cannot use ensureTarget due to requiring more than one parameter in its creation
export const ensureWebhook = async (
  service: Operations.CreateWebhookTargetService &
    Operations.GetWebhookTargetsService,
  params: EnsureWebhookParams | undefined,
): Promise<string | undefined> => {
  if (params === undefined) {
    return undefined;
  }

  const query = await service.getWebhookTargets({});
  const existing = query.webhookTarget;

  const found = existing?.find(
    (it) =>
      it?.url.toLowerCase() === params.url.toLowerCase() &&
      it?.format === params.format,
  );

  if (found !== undefined) {
    return found.id;
  }

  const mutation = await service.createWebhookTarget({
    ...params,
    name: params.url.toLowerCase(),
    url: params.url.toLowerCase(),
  });
  const created = mutation.createWebhookTarget;
  if (created === undefined) {
    throw new Error('Failed to create webhook target');
  }

  return created.id;
};
