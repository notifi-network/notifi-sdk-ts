import type { Operations, Types } from '@notifi-network/notifi-graphql';

import {
  BroadcastEventTypeItem,
  CreateSupportConversationEventTypeItem,
  CustomTopicTypeItem,
  DirectPushEventTypeItem,
  EventTypeItem,
  FilterOptions,
  FusionEventTypeItem,
  HealthCheckEventTypeItem,
  PriceChangeEventTypeItem,
  ThresholdDirection,
  TradingPairEventTypeItem,
  WalletBalanceEventTypeItem,
  XMTPTopicTypeItem,
} from '../models';
import { areIdsEqual } from '../utils/areIdsEqual';
import {
  resolveCheckRatioArrayRef,
  resolveNumberRef,
  resolveStringArrayRef,
  resolveStringRef,
} from '../utils/resolveRef';

const ensureDirectPushSource = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  _eventType: DirectPushEventTypeItem,
  _inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  const source = sources?.find(
    (it) => it !== undefined && it.type === 'DIRECT_PUSH',
  );

  if (source === undefined) {
    throw new Error('Failed to identify direct push source');
  }

  return source;
};

const ensureFusionSource = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: FusionEventTypeItem,
  inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const address = resolveStringRef(
    eventType.name,
    eventType.sourceAddress,
    inputs,
  );

  const eventTypeId = resolveStringRef(
    eventType.name,
    eventType.fusionEventId,
    inputs,
  );

  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  const existing = sources?.find(
    (it) =>
      it !== undefined &&
      it.type === 'FUSION_SOURCE' &&
      it.blockchainAddress === address &&
      it.fusionEventTypeId === eventTypeId,
  );
  if (existing !== undefined) {
    return existing;
  }

  const createMutation = await service.createSource({
    type: 'FUSION_SOURCE',
    blockchainAddress: address,
    fusionEventTypeId: eventTypeId,
  });

  const source = createMutation.createSource;

  if (source === undefined) {
    throw new Error('Failed to create source');
  }

  return source;
};

const ensureBroadcastSource = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: BroadcastEventTypeItem,
  inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  if (sources === undefined) {
    throw new Error('Failed to fetch sources');
  }

  const address = resolveStringRef(
    eventType.name,
    eventType.broadcastId,
    inputs,
  );
  const existing = sources.find(
    (it) => it?.type === 'BROADCAST' && it.blockchainAddress === address,
  );

  if (existing !== undefined) {
    return existing;
  }

  const createMutation = await service.createSource({
    type: 'BROADCAST',
    blockchainAddress: address,
  });

  const result = createMutation.createSource;
  if (result === undefined) {
    throw new Error('Failed to create source');
  }

  return result;
};

const ensureTradingPairSource = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  _eventType: TradingPairEventTypeItem,
  _inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  const source = sources?.find((it) => it?.type === 'DIRECT_PUSH');

  if (source === undefined) {
    throw new Error('Failed to identify trading pair source (=directPush)');
  }

  return source;
};

const ensurePriceChangeSources = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: PriceChangeEventTypeItem,
  _inputs: Record<string, unknown>,
): Promise<ReadonlyArray<Types.SourceFragmentFragment>> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  if (sources === undefined) {
    throw new Error('Failed to fetch sources');
  }

  const results: Types.SourceFragmentFragment[] = [];
  const sourcesToCreate = new Set(eventType.tokenIds);
  sources.forEach((existing) => {
    if (existing?.type === 'COIN_PRICE_CHANGES') {
      sourcesToCreate.delete(existing.blockchainAddress);
      results.push(existing);
    }
  });

  if (sourcesToCreate.size > 0) {
    let createSourcePromise = Promise.resolve();
    sourcesToCreate.forEach((tokenId) => {
      createSourcePromise = createSourcePromise.then(async () => {
        const result = await service.createSource({
          type: 'COIN_PRICE_CHANGES',
          blockchainAddress: tokenId,
        });

        const source = result.createSource;
        if (source !== undefined) {
          results.push(source);
        }
      });
    });

    await createSourcePromise;
  }

  return results;
};

const ensureWalletBalanceSources = async (
  service: Operations.GetSourcesService &
    Operations.CreateSourceService &
    Operations.GetConnectedWalletsService,
  _eventType: WalletBalanceEventTypeItem,
  _inputs: Record<string, unknown>,
): Promise<Array<Types.SourceFragmentFragment>> => {
  const connectedWalletsQuery = await service.getConnectedWallets({});
  const connectedWallets = connectedWalletsQuery.connectedWallet;
  if (!connectedWallets) {
    throw new Error('Failed to fetch connected wallets');
  }
  const connectedWalletSources = connectedWallets.map((it) => {
    const sourceType = ((wallet?: Types.WalletBlockchain): Types.SourceType => {
      switch (wallet) {
        case 'ACALA':
          return 'ACALA_WALLET';
        case 'APTOS':
          return 'APTOS_WALLET';
        case 'ARBITRUM':
          return 'ARBITRUM_WALLET';
        case 'AVALANCHE':
          return 'AVALANCHE_WALLET';
        case 'BINANCE':
          return 'BINANCE_WALLET';
        case 'ETHEREUM':
          return 'ETHEREUM_WALLET';
        case 'BASE':
          return 'ETHEREUM_WALLET';
        case 'POLYGON':
          return 'POLYGON_WALLET';
        case 'SOLANA':
          return 'SOLANA_WALLET';
        case 'OPTIMISM':
          return 'OPTIMISM_WALLET';
        case 'SUI':
          return 'SUI_WALLET';
        case 'ZKSYNC':
          return 'ZKSYNC_WALLET';
        default:
          throw new Error('Unsupported walletType');
      }
    })(it?.walletBlockchain);

    const sourceAddress = it?.address ?? '';
    return {
      name: `${sourceType} ${sourceAddress}`,
      blockchainAddress: sourceAddress,
      type: sourceType,
    };
  });

  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  if (sources === undefined) {
    throw new Error('Failed to fetch sources');
  }

  const promises = connectedWalletSources.map(async (connectedWalletSource) => {
    const found = sources.find(
      (source) => source?.name === connectedWalletSource.name,
    );
    if (found) {
      return found;
    }
    const { createSource: newSource } = await service.createSource(
      connectedWalletSource,
    );
    if (!newSource) {
      throw new Error(`Failed to create ${connectedWalletSource.type} source`);
    }
    return newSource;
  });

  const ensuredSources = await Promise.all(promises);

  return ensuredSources;
};

const normalizeSourceAddress = (
  sourceType: Types.SourceType,
  blockchainAddress: string,
): string => {
  switch (sourceType) {
    case 'ETHEREUM_WALLET':
    case 'POLYGON_WALLET':
    case 'ARBITRUM_WALLET':
    case 'BINANCE_WALLET':
    case 'OPTIMISM_WALLET':
    case 'AVALANCHE_WALLET':
    case 'ZKSYNC_WALLET':
    case 'BENQI':
    case 'DELTA_PRIME':
    case 'DELTA_PRIME_LENDING_RATES':
    case 'APTOS_WALLET':
      return normalizeHexString(blockchainAddress);
    default:
      return blockchainAddress;
  }
};

export const normalizeHexString = (input: string): string => {
  let result = input;
  if (input !== '') {
    result = input.toLowerCase();
    if (!result.startsWith('0x')) {
      result = '0x' + result;
    }
  }
  return result;
};

const ensureCustomSources = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: CustomTopicTypeItem,
  inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  if (sources === undefined) {
    throw new Error('Failed to fetch sources');
  }

  const address = resolveStringRef(
    eventType.name,
    eventType.sourceAddress,
    inputs,
  );
  const sourceAddress = normalizeSourceAddress(eventType.sourceType, address);
  const existing = sources.find(
    (it) =>
      it?.type === eventType.sourceType &&
      it.blockchainAddress === sourceAddress,
  );

  if (existing !== undefined) {
    return existing;
  }

  const createMutation = await service.createSource({
    type: eventType.sourceType,
    blockchainAddress: sourceAddress,
  });

  const result = createMutation.createSource;
  if (result === undefined) {
    throw new Error('Failed to create source');
  }

  return result;
};

const ensureXMTPSources = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: XMTPTopicTypeItem,
  inputs: Record<string, unknown>,
): Promise<Array<Types.SourceFragmentFragment>> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  if (sources === undefined) {
    throw new Error('Failed to fetch sources');
  }
  const XMTPTopics = resolveStringArrayRef(
    eventType.name,
    eventType.XMTPTopics,
    inputs,
  );
  const XMTPTopicSources = XMTPTopics.map((topic) => ({
    name: topic,
    blockchainAddress: topic,
    type: 'XMTP' as Types.SourceType,
  }));

  const promises = XMTPTopicSources.map(async (source) => {
    const found = sources.find(
      (it) => it?.type === 'XMTP' && it.name === source.name,
    );
    if (found) {
      return found;
    }
    const { createSource: newSource } = await service.createSource(source);
    if (!newSource) {
      throw new Error('Failed to create XMTP source');
    }
    return newSource;
  });

  const ensuredSources = await Promise.all(promises);
  return ensuredSources;
};

const ensureHealthCheckSources = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  _eventType: HealthCheckEventTypeItem,
  _inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  const source = sources?.find((it) => it?.type === 'DIRECT_PUSH');

  if (source === undefined) {
    throw new Error('Failed to identify Health Check source (=directPush)');
  }

  return source;
};

const ensureCreateSupportConversationSources = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: CreateSupportConversationEventTypeItem,
  _inputs: Record<string, unknown>,
): Promise<Types.SourceFragmentFragment> => {
  const sourcesQuery = await service.getSources({});
  const sources = sourcesQuery.source;
  const source = sources?.find((it) => it?.type === 'NOTIFI_CHAT');
  if (source) {
    return source;
  }
  const createMutation = await service.createSource({
    type: eventType.sourceType,
    blockchainAddress: '*',
  });

  const newSource = createMutation.createSource;
  if (newSource === undefined) {
    throw new Error('Failed to create source');
  }

  return newSource;
};

const ensureSources = async (
  service: Operations.GetSourcesService &
    Operations.CreateSourceService &
    Operations.GetConnectedWalletsService,
  eventType: EventTypeItem,
  inputs: Record<string, unknown>,
): Promise<ReadonlyArray<Types.SourceFragmentFragment>> => {
  switch (eventType.type) {
    case 'directPush': {
      const source = await ensureDirectPushSource(service, eventType, inputs);
      return [source];
    }
    case 'broadcast': {
      const source = await ensureBroadcastSource(service, eventType, inputs);
      return [source];
    }
    case 'tradingPair': {
      const source = await ensureTradingPairSource(service, eventType, inputs);
      return [source];
    }
    case 'priceChange': {
      const sources = await ensurePriceChangeSources(
        service,
        eventType,
        inputs,
      );
      return sources;
    }
    case 'walletBalance': {
      const sources = await ensureWalletBalanceSources(
        service,
        eventType,
        inputs,
      );
      return sources;
    }
    case 'custom': {
      const source = await ensureCustomSources(service, eventType, inputs);
      return [source];
    }
    case 'XMTP': {
      const sources = await ensureXMTPSources(service, eventType, inputs);
      return sources;
    }
    case 'healthCheck': {
      const source = await ensureHealthCheckSources(service, eventType, inputs);
      return [source];
    }
    case 'fusionToggle':
    case 'fusion': {
      const source = await ensureFusionSource(service, eventType, inputs);
      return [source];
    }
    case 'createSupportConversation': {
      const source = await ensureCreateSupportConversationSources(
        service,
        eventType,
        inputs,
      );
      return [source];
    }
    case 'label': {
      throw new Error('Unsupported event type');
    }
  }
};

const ensureSourceGroup = async (
  service: Operations.CreateSourceService &
    Operations.GetSourcesService &
    Operations.GetSourceGroupsService &
    Operations.CreateSourceGroupService &
    Operations.UpdateSourceGroupService,
  name: string,
  sourceIds: string[],
): Promise<Types.SourceGroupFragmentFragment> => {
  const sourceGroupsQuery = await service.getSourceGroups({});
  const existing = sourceGroupsQuery.sourceGroup?.find(
    (it) => it !== undefined && it.name === name,
  );

  if (existing === undefined) {
    const createMutation = await service.createSourceGroup({
      name,
      sourceIds,
    });
    const createResult = createMutation.createSourceGroup;
    if (createResult === undefined) {
      throw new Error('Failed to create source group');
    }

    return createResult;
  }

  if (areIdsEqual(sourceIds, existing.sources ?? [])) {
    return existing;
  }

  const updateMutation = await service.updateSourceGroup({
    id: existing.id,
    name,
    sourceIds,
  });
  const updateResult = updateMutation.updateSourceGroup;
  if (updateResult === undefined) {
    throw new Error('Failed to update source group');
  }

  return updateResult;
};

type GetFilterResults = Readonly<{
  filter: Types.FilterFragmentFragment;
  filterOptions: FilterOptions;
}>;

const getDirectPushFilter = (
  source: Types.SourceFragmentFragment,
  eventType: DirectPushEventTypeItem,
  inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'DIRECT_TENANT_MESSAGES',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter');
  }

  const type = resolveStringRef(eventType.name, eventType.directPushId, inputs);
  const filterOptions: FilterOptions = {
    directMessageType: type,
  };

  return {
    filter,
    filterOptions,
  };
};

const getBroadcastFilter = (
  source: Types.SourceFragmentFragment,
  _eventType: BroadcastEventTypeItem,
  _inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'BROADCAST_MESSAGES',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter');
  }

  return {
    filter,
    filterOptions: {},
  };
};

export type TradingPairInputs = {
  pair: string;
  direction: 'below' | 'above';
  price: number;
};

const tradingPairInputsValidator = (
  inputs: Record<string, unknown>,
): inputs is TradingPairInputs => {
  if (
    typeof inputs.direction !== 'string' ||
    typeof inputs.price !== 'number' ||
    typeof inputs.pair !== 'string'
  ) {
    return false;
  }
  return true;
};

const getTradingPairFilter = (
  source: Types.SourceFragmentFragment,
  eventType: TradingPairEventTypeItem,
  inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'DIRECT_TENANT_MESSAGES',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve TradingPair filter (=directMessage)');
  }
  const tradingPairs = resolveStringArrayRef(
    eventType.name,
    eventType.tradingPairs,
    inputs,
  );
  if (tradingPairs.length === 0) throw new Error('No trading pairs found');

  const tradingPair = tradingPairInputsValidator(inputs)
    ? inputs.pair
    : tradingPairs[0];

  const value = tradingPairInputsValidator(inputs)
    ? inputs.price.toFixed(8)
    : '1.00000000';

  return {
    filter,
    filterOptions: {
      tradingPair,
      values: {
        and: [
          {
            key: 'spotPrice',
            op: inputs.direction === 'above' ? 'gt' : 'lt',
            value,
          },
        ],
      },
    },
  };
};

const getPriceChangeFilter = (
  sources: ReadonlyArray<Types.SourceFragmentFragment>,
  _eventType: PriceChangeEventTypeItem,
  _inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = sources
    .flatMap((it) => it.applicableFilters ?? [])
    .find((it) => it?.filterType === 'COIN_PRICE_CHANGE_EVENTS');
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter');
  }

  return {
    filter,
    filterOptions: {},
  };
};

const getWalletBalanceSourceFilter = (
  source: Types.SourceFragmentFragment,
  _eventType: WalletBalanceEventTypeItem,
  _inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'BALANCE',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter: wallet balance');
  }
  return {
    filter,
    filterOptions: {},
  };
};
const getFusionSourceFilter = (
  source: Types.SourceFragmentFragment,
  eventType: FusionEventTypeItem,
  inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'FUSION_SOURCE',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve fusion source filter');
  }

  let filterOptions: FilterOptions = {}; // Default {}
  if (
    eventType.selectedUIType === 'TOGGLE' ||
    eventType.selectedUIType === 'MULTI_THRESHOLD'
  ) {
    if (eventType.alertFrequency !== undefined) {
      filterOptions = {
        alertFrequency: eventType.alertFrequency,
      };
    }
  } else if (eventType.selectedUIType === 'HEALTH_CHECK') {
    // Use synthetic ref values to get from input (ratio)
    const healthRatioKey = `${eventType.name}__healthRatio`;
    if (!inputs[healthRatioKey]) {
      // Set default value if not provided
      inputs[`${eventType.name}__healthRatio`] = eventType.checkRatios[1].ratio;
    }
    const healthRatio = resolveNumberRef(
      healthRatioKey,
      { type: 'ref', ref: healthRatioKey },
      inputs,
    );
    // Use synthetic ref values to get from input (direction)
    const thresholdDirectionKey = `${eventType.name}__healthThresholdDirection`;
    if (!inputs[thresholdDirectionKey]) {
      // Set default value if not provided
      inputs[thresholdDirectionKey] =
        eventType.checkRatios[0].type === 'above' ? 'above' : 'below';
    }
    const thresholdDirection =
      resolveStringRef(
        thresholdDirectionKey,
        { type: 'ref', ref: thresholdDirectionKey },
        inputs,
      ) ?? eventType.checkRatios[0].ratio;

    if (!healthRatio || !thresholdDirection) {
      throw new Error('Failed to retrieve health ratio or direction');
    }

    filterOptions = {
      alertFrequency: eventType.alertFrequency,
      threshold:
        eventType.numberType === 'percentage' ? healthRatio / 100 : healthRatio,
      thresholdDirection: thresholdDirection === 'above' ? 'above' : 'below',
    };
  }

  return {
    filter,
    filterOptions,
  };
};

const getCustomFilterOptions = (
  eventType: CustomTopicTypeItem,
  inputs: Record<string, unknown>,
): FilterOptions => {
  switch (eventType.selectedUIType) {
    case 'TOGGLE':
      return eventType.filterOptions;
    case 'HEALTH_CHECK': {
      // Use synthetic ref values to get from input (ratio)
      const healthRatioKey = `${eventType.name}__healthRatio`;
      const healthRatio =
        resolveNumberRef(
          healthRatioKey,
          { type: 'ref', ref: healthRatioKey },
          inputs,
        ) ?? eventType.checkRatios[0].ratio; // Fallback to 1st checkRatios
      // Use synthetic ref values to get from input (direction)
      const thresholdDirectionKey = `${eventType.name}__healthThresholdDirection`;
      const thresholdDirection =
        resolveStringRef(
          thresholdDirectionKey,
          { type: 'ref', ref: thresholdDirectionKey },
          inputs,
        ) ?? eventType.checkRatios[0].ratio; // Fallback to 1st checkRatios

      if (!healthRatio || !thresholdDirection) {
        throw new Error('Failed to retrieve health ratio or direction');
      }

      return {
        alertFrequency: eventType.alertFrequency,
        threshold:
          eventType.numberType === 'percentage'
            ? healthRatio / 100
            : healthRatio,
        thresholdDirection: thresholdDirection === 'above' ? 'above' : 'below',
      };
    }
  }
};

const getCustomFilter = (
  source: Types.SourceFragmentFragment,
  eventType: CustomTopicTypeItem,
  inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === eventType.filterType,
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter');
  }

  return {
    filter,
    filterOptions: getCustomFilterOptions(eventType, inputs),
  };
};

const getXMTPFilter = (
  source: Types.SourceFragmentFragment,
  _eventType: XMTPTopicTypeItem,
  _inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'WEB3_CHAT_MESSAGES',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter: XMTP');
  }
  return {
    filter,
    filterOptions: {},
  };
};

const getCreateSupportConversationFilter = (
  source: Types.SourceFragmentFragment,
  eventType: CreateSupportConversationEventTypeItem,
  _inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'NOTIFI_CHAT_MESSAGES',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter: CreateSupportConversation');
  }
  return {
    filter,
    filterOptions: {
      alertFrequency: eventType.alertFrequency,
    },
  };
};

export type HealthCheckEventInputsWithIndex = {
  index: number; // The index of CheckRatio list
  [key: string]: unknown; // The rest of inputs
};

export type HealthCheckEventInputsWithCustomPercentage = {
  thresholdDirection: ThresholdDirection; // The direction of threshold
  customPercentage: number; // The percentage value of custom health check
  [key: string]: unknown; // The rest of inputs
};

export type HealthCheckInputs =
  | HealthCheckEventInputsWithIndex
  | HealthCheckEventInputsWithCustomPercentage;

const checkInputsIsWithIndex = (
  inputs: Record<string, unknown>,
): inputs is HealthCheckEventInputsWithIndex => {
  if ('index' in inputs) {
    return true;
  }
  return false;
};

const getHealthCheckFilter = (
  source: Types.SourceFragmentFragment,
  eventType: HealthCheckEventTypeItem,
  inputs: Record<string, unknown>,
): GetFilterResults => {
  const filter = source.applicableFilters?.find(
    (it) => it?.filterType === 'VALUE_THRESHOLD',
  );
  if (filter === undefined) {
    throw new Error('Failed to retrieve filter: healthCheck');
  }

  const checkRatios = resolveCheckRatioArrayRef(
    eventType.name,
    eventType.checkRatios,
    inputs,
  );

  // Default: checkRatios[0]
  let threshold = checkRatios[0].ratio;
  let thresholdDirection = checkRatios[0].type;

  const checkInputsIsWithCustomPercentage = (
    inputs: Record<string, unknown>,
  ): inputs is HealthCheckEventInputsWithCustomPercentage => {
    if ('customPercentage' in inputs && 'thresholdDirection' in inputs) {
      return true;
    }
    return false;
  };

  if (checkInputsIsWithIndex(inputs)) {
    threshold = checkRatios[inputs.index].ratio;
    thresholdDirection = checkRatios[inputs.index].type;
  } else if (checkInputsIsWithCustomPercentage(inputs)) {
    threshold = inputs.customPercentage;
    thresholdDirection = inputs.thresholdDirection;
  }

  return {
    filter,
    filterOptions: {
      alertFrequency: eventType.alertFrequency,
      threshold,
      thresholdDirection,
    },
  };
};

export const ensureSourceAndFilters = async (
  service: Operations.CreateSourceService &
    Operations.GetSourcesService &
    Operations.GetSourceGroupsService &
    Operations.CreateSourceGroupService &
    Operations.UpdateSourceGroupService &
    Operations.GetConnectedWalletsService,
  eventType: EventTypeItem,
  inputs: Record<string, unknown>,
): Promise<
  Readonly<{
    sourceGroup: Types.SourceGroupFragmentFragment;
    filter: Types.FilterFragmentFragment;
    filterOptions: FilterOptions;
  }>
> => {
  const sources = await ensureSources(service, eventType, inputs);
  const sourceGroup = await ensureSourceGroup(
    service,
    eventType.name,
    sources.map((it) => it.id),
  );

  switch (eventType.type) {
    case 'directPush': {
      const { filter, filterOptions } = getDirectPushFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'broadcast': {
      const { filter, filterOptions } = getBroadcastFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }

    case 'tradingPair': {
      if (!tradingPairInputsValidator(inputs)) {
        throw new Error('Invalid tradingPair inputs');
      }
      const { filter, filterOptions } = getTradingPairFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'priceChange': {
      const { filter, filterOptions } = getPriceChangeFilter(
        sources,
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'custom': {
      const { filter, filterOptions } = getCustomFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'XMTP': {
      const { filter, filterOptions } = getXMTPFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'healthCheck': {
      const { filter, filterOptions } = getHealthCheckFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'label': {
      throw new Error('Unsupported event type');
    }
    case 'walletBalance': {
      const { filter, filterOptions } = getWalletBalanceSourceFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'fusionToggle':
    case 'fusion': {
      const { filter, filterOptions } = getFusionSourceFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
    case 'createSupportConversation': {
      const { filter, filterOptions } = getCreateSupportConversationFilter(
        sources[0],
        eventType,
        inputs,
      );
      return {
        sourceGroup,
        filter,
        filterOptions,
      };
    }
  }
};
