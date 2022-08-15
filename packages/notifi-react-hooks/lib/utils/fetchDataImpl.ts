import {
  Alert,
  EmailTarget,
  Filter,
  GetAlertsService,
  GetEmailTargetsService,
  GetSmsTargetsService,
  GetSourceGroupsService,
  GetSourcesService,
  GetTargetGroupsService,
  GetTelegramTargetsService,
  GetTopicsService,
  GetWebhookTargetsService,
  SmsTarget,
  Source,
  SourceGroup,
  TargetGroup,
  TelegramTarget,
  WebhookTarget,
} from '@notifi-network/notifi-core';

export type InternalData = {
  alerts: Alert[];
  filters: Filter[];
  sources: Source[];
  sourceGroups: SourceGroup[];
  targetGroups: TargetGroup[];
  emailTargets: EmailTarget[];
  smsTargets: SmsTarget[];
  telegramTargets: TelegramTarget[];
  webhookTargets: WebhookTarget[];
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
  GetSourcesService &
  GetSourceGroupsService &
  GetTargetGroupsService &
  GetEmailTargetsService &
  GetSmsTargetsService &
  GetTelegramTargetsService &
  GetTopicsService &
  GetWebhookTargetsService;

const doFetchData = async (service: Service): Promise<InternalData> => {
  const [
    alerts,
    sources,
    sourceGroups,
    targetGroups,
    emailTargets,
    smsTargets,
    telegramTargets,
    webhookTargets,
  ] = await Promise.all([
    service.getAlerts(),
    service.getSources(),
    service.getSourceGroups(),
    service.getTargetGroups(),
    service.getEmailTargets(),
    service.getSmsTargets(),
    service.getTelegramTargets(),
    service.getWebhookTargets(),
  ]);

  const filterIds = new Set<string | null>();
  const filters: Filter[] = [];
  sources.forEach((source) => {
    source.applicableFilters.forEach((filter) => {
      if (!filterIds.has(filter.id)) {
        filters.push(filter);
        filterIds.add(filter.id);
      }
    });
  });

  return {
    alerts: [...alerts],
    filters,
    sources: [...sources],
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
