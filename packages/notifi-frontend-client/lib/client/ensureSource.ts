import type { Operations, Types } from '@notifi-network/notifi-graphql';

import {
  BroadcastEventTypeItem,
  CustomTopicTypeItem,
  DirectPushEventTypeItem,
  EventTypeItem,
  FilterOptions,
  PriceChangeEventTypeItem,
  TradingPairEventTypeItem,
} from '../models';
import { areIdsEqual } from '../utils/areIdsEqual';
import {
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

const ensureSources = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
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
    case 'custom': {
      const source = await ensureCustomSources(service, eventType, inputs);
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

const getTradingPairFilter = (
  source: Types.SourceFragmentFragment,
  eventType: TradingPairEventTypeItem,
  inputs: TradingPairInputs,
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

  if (tradingPairs.length === 0) {
    throw new Error('Failed to retrieve TradingPairs');
  }

  return {
    filter,
    filterOptions: {
      tradingPair: tradingPairs.length > 0 ? tradingPairs[0] : undefined,
      values: {
        and: [
          {
            key: 'spotPrice',
            op: inputs.direction === 'below' ? 'lt' : 'gt',
            value: inputs.value.toFixed(8),
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

const getCustomFilterOptions = (
  eventType: CustomTopicTypeItem,
  inputs: Record<string, unknown>,
): FilterOptions => {
  switch (eventType.selectedUIType) {
    case 'TOGGLE':
      return eventType.filterOptions;
    case 'HEALTH_CHECK': {
      // Use synthetic ref values to get from input
      const healthRatioKey = `${eventType.name}__healthRatio`;
      const healthRatio = resolveNumberRef(
        healthRatioKey,
        { type: 'ref', ref: healthRatioKey },
        inputs,
      );

      return {
        alertFrequency: eventType.alertFrequency,
        threshold:
          eventType.numberType === 'percentage'
            ? healthRatio / 100
            : healthRatio,
        thresholdDirection: eventType.checkRatios[0]?.type ?? 'below',
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

type TradingPairInputs = {
  direction: 'below' | 'above';
  value: number;
};

const TradingPairInputsValidator = (
  inputs: Record<string, unknown>,
): inputs is TradingPairInputs => {
  if (
    typeof inputs.direction !== 'string' ||
    typeof inputs.value !== 'number'
  ) {
    return false;
  }
  return true;
};

export const ensureSourceAndFilters = async (
  service: Operations.CreateSourceService &
    Operations.GetSourcesService &
    Operations.GetSourceGroupsService &
    Operations.CreateSourceGroupService &
    Operations.UpdateSourceGroupService,
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
      if (!TradingPairInputsValidator(inputs)) {
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
    case 'label': {
      throw new Error('Unsupported event type');
    }
  }
};
