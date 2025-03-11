// All method in ensureTarget.ts are deprecated, use methods in alterTarget.ts instead
import type { Operations, Types } from '@notifi-network/notifi-graphql';

type EnsureTargetFuncFactory = <
  CreateService,
  GetService,
  T extends Readonly<{ id?: string }>,
>(
  create: CreateFunc<CreateService, T>,
  fetch: FetchFunc<GetService, T>,
  identify: IdentifyFunc<T>,
  valueTransform?: ValueTransformFunc,
) => EnsureTargetFunc<CreateService, GetService>;

export type CreateFunc<CreateService, T> = (
  service: CreateService,
  value: string,
) => Promise<T>;
export type FetchFunc<GetService, T> = (
  service: GetService,
) => Promise<Array<T | undefined> | undefined>;
export type IdentifyFunc<T> = (arg: T | undefined) => string | undefined;
export type ValueTransformFunc = (value: string) => string;

type EnsureTargetFunc<CreateService, GetService> = (
  service: CreateService & GetService,
  value: string | undefined,
) => Promise<string | undefined>;
/** @deprecated Use alterTarget instead */
export const ensureTarget: EnsureTargetFuncFactory = (
  create,
  fetch,
  identify,
  valueTransform,
) => {
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
/** @deprecated Use alterTarget instead */
export const ensureEmail = ensureTarget(
  // Create email target function
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
  // Fetch email target function
  async (service: Operations.GetEmailTargetsService) => {
    const query = await service.getEmailTargets({});
    return query.emailTarget;
  },
  // Email target identify generator
  (arg: Types.EmailTargetFragmentFragment | undefined) =>
    arg?.emailAddress?.toLowerCase(),
  // Email target value transform function
  (value: string) => value.toLowerCase(),
);
/** @deprecated Use alterTarget instead */
export const ensureSms = ensureTarget(
  // Create SMS target function
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
  // Fetch SMS target function
  async (service: Operations.GetSmsTargetsService) => {
    const query = await service.getSmsTargets({});
    return query.smsTarget;
  },
  // SMS target identify generator
  (arg: Types.SmsTargetFragmentFragment | undefined) => arg?.phoneNumber,
);
/** @deprecated Use alterTarget instead */
export const renewTelegram = ensureTarget(
  // Create telegram target function
  async (service: Operations.CreateTelegramTargetService, value: string) => {
    const mutation = await service.createTelegramTarget({
      name: value,
      value,
    });

    const result = mutation.createTelegramTarget;
    if (result === undefined) {
      throw new Error('Failed to create telegramTarget');
    }

    return result;
  },
  // Fetch telegram target function
  async (service: Operations.GetTelegramTargetsService) => {
    const query = await service.getTelegramTargets({});
    return query.telegramTarget;
  },
  // Telegram target identify generator
  (arg: Types.TelegramTargetFragmentFragment | undefined) => arg?.name,
  // Telegram target value transform function
  () => 'Default',
);
/** @deprecated Use alterTarget instead */
export const ensureDiscord = ensureTarget(
  // Create Discord target function
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
  // Fetch Discord target function
  async (service: Operations.GetDiscordTargetsService) => {
    const query = await service.getDiscordTargets({});
    return query.discordTarget;
  },
  // Discord target identify generator
  (arg: Types.DiscordTargetFragmentFragment | undefined) => arg?.name,
  // Discord target value transform function
  () => 'Default',
);
/** @deprecated Use alterTarget instead */
export const ensureSlack = ensureTarget(
  // Create Slack target function
  async (
    service: Operations.CreateSlackChannelTargetService,
    value: string,
  ) => {
    const mutation = await service.createSlackChannelTarget({
      name: value,
      value,
    });

    const result = mutation.createSlackChannelTarget.slackChannelTarget;
    if (result === undefined) {
      throw new Error('Failed to create slackTarget');
    }

    return result;
  },
  // Fetch Slack target function
  async (service: Operations.GetSlackChannelTargetsService) => {
    const query = await service.getSlackChannelTargets({});
    return query.slackChannelTargets?.nodes;
  },
  // Slack target identify generator
  (arg: Types.SlackChannelTargetFragmentFragment | undefined) => arg?.name,
  // Slack target value transform function
  () => 'Default',
);
/** @deprecated Use alterTarget instead */
export const ensureWeb3 = ensureTarget(
  // Create Wallet target function
  async (service: Operations.CreateWeb3TargetService, value: string) => {
    const mutation = await service.createWeb3Target({
      name: value,
      accountId: '',
      walletBlockchain: 'OFF_CHAIN',
      web3TargetProtocol: 'XMTP',
    });

    const result = mutation.createWeb3Target;
    if (result === undefined || result.id === undefined) {
      throw new Error('Failed to create web3Target');
    }
    return result;
  },
  // Fetch Wallet target function
  async (service: Operations.GetWeb3TargetsService) => {
    const query = await service.getWeb3Targets({});
    return query.web3Targets?.nodes;
  },
  // Wallet target identify generator
  (arg: Types.Web3TargetFragmentFragment | undefined) => arg?.name,
  // Wallet target value transform function
  () => 'Default',
);

/** @deprecated Use alterTarget instead */
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
