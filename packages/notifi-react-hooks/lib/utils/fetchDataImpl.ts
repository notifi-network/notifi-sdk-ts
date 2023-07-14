import {
  Alert,
  ConnectedWallet,
  DiscordTarget,
  EmailTarget,
  GetAlertsService,
  GetConnectedWalletsService,
  GetDiscordTargetsService,
  GetEmailTargetsService,
  GetSmsTargetsService,
  GetSourceGroupsService,
  GetSourcesService,
  GetTargetGroupsService,
  GetTelegramTargetsService,
  GetTopicsService,
  GetWebhookTargetsService,
  SmsTarget,
  SourceGroup,
  TargetGroup,
  TelegramTarget,
  WebhookTarget,
} from '@notifi-network/notifi-core';
import { Types } from '@notifi-network/notifi-graphql';

export type InternalData = {
  alerts: Alert[];
  connectedWallets: ConnectedWallet[];
  filters: Types.FilterFragmentFragment[];
  sources: Types.SourceFragmentFragment[];
  sourceGroups: SourceGroup[];
  targetGroups: TargetGroup[];
  emailTargets: EmailTarget[];
  smsTargets: SmsTarget[];
  telegramTargets: TelegramTarget[];
  webhookTargets: WebhookTarget[];
  discordTargets: DiscordTarget[];
};

export type FetchDataState = {
  pendingPromise?: Promise<InternalData>;
  lastSuccessTime?: number;
  lastSuccessData?: InternalData;
};

export type TimeProvider = Readonly<{
  now(): number;
}>;

type Service = GetAlertsService &
  GetConnectedWalletsService &
  GetSourcesService &
  GetSourceGroupsService &
  GetTargetGroupsService &
  GetEmailTargetsService &
  GetDiscordTargetsService &
  GetSmsTargetsService &
  GetTelegramTargetsService &
  GetTopicsService &
  GetWebhookTargetsService;

const doFetchData = async (service: Service): Promise<InternalData> => {
  const [
    alerts,
    connectedWallets,
    sources,
    sourceGroups,
    targetGroups,
    emailTargets,
    smsTargets,
    telegramTargets,
    webhookTargets,
    discordTargets,
  ] = await Promise.all([
    service.getAlerts(),
    service.getConnectedWallets(),
    service.getSources(),
    service.getSourceGroups(),
    service.getTargetGroups(),
    service.getEmailTargets(),
    service.getSmsTargets(),
    service.getTelegramTargets(),
    service.getWebhookTargets(),
    service.getDiscordTargets(),
  ]);

  const filterIds = new Set<string | null>();
  const filters: Types.FilterFragmentFragment[] = [];
  sources.forEach((source) => {
    source.applicableFilters?.forEach((filter) => {
      if (filter && !filterIds.has(filter?.id ?? '')) {
        filters.push(filter);
        filterIds.add(filter.id);
      }
    });
  });

  return {
    alerts: [...alerts],
    connectedWallets: [...connectedWallets],
    filters,
    sources: [...sources],
    discordTargets: [...discordTargets],
    sourceGroups: [...sourceGroups],
    targetGroups: [...targetGroups],
    emailTargets: [...emailTargets],
    smsTargets: [...smsTargets],
    telegramTargets: [...telegramTargets],
    webhookTargets: [...webhookTargets],
  };
};

const DataTtlMs = 1000;

const fetchDataImpl = async (
  service: Service,
  timeProvider: TimeProvider,
  state: FetchDataState,
): Promise<InternalData> => {
  if (state.pendingPromise !== undefined) {
    return await state.pendingPromise;
  }

  if (
    state.lastSuccessTime !== undefined &&
    state.lastSuccessData !== undefined
  ) {
    const currentTime = timeProvider.now();
    if (currentTime <= state.lastSuccessTime + DataTtlMs) {
      return state.lastSuccessData;
    }
  }

  const promise = doFetchData(service);
  state.pendingPromise = promise;
  const results = await promise;
  state.pendingPromise = undefined;
  state.lastSuccessTime = timeProvider.now();
  state.lastSuccessData = results;
  return results;
};

export default fetchDataImpl;
