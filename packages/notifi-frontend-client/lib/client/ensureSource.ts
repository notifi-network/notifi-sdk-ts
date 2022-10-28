import type { Operations, Types } from '@notifi-network/notifi-graphql';
import { SourceFragmentFragment } from 'notifi-graphql/lib/gql/generated';

import {
  BroadcastEventTypeItem,
  DirectPushEventTypeItem,
  EventTypeItem,
  FilterOptions,
} from '../models';
import { areIdsEqual } from '../utils/areIdsEqual';
import { resolveStringRef } from '../utils/resolveRef';

const ensureDirectPushSource = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  _eventType: DirectPushEventTypeItem,
  _inputs: Record<string, string | undefined>,
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
  inputs: Record<string, string | undefined>,
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

const ensureSource = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  eventType: EventTypeItem,
  inputs: Record<string, string | undefined>,
): Promise<Types.SourceFragmentFragment> => {
  switch (eventType.type) {
    case 'directPush': {
      return ensureDirectPushSource(service, eventType, inputs);
    }
    case 'broadcast': {
      return ensureBroadcastSource(service, eventType, inputs);
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
  source: SourceFragmentFragment,
  eventType: DirectPushEventTypeItem,
  inputs: Record<string, string | undefined>,
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
  source: SourceFragmentFragment,
  _eventType: BroadcastEventTypeItem,
  _inputs: Record<string, string | undefined>,
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

export const ensureSourceAndFilters = async (
  service: Operations.CreateSourceService &
    Operations.GetSourcesService &
    Operations.GetSourceGroupsService &
    Operations.CreateSourceGroupService &
    Operations.UpdateSourceGroupService,
  eventType: EventTypeItem,
  inputs: Record<string, string | undefined>,
): Promise<
  Readonly<{
    sourceGroup: Types.SourceGroupFragmentFragment;
    filter: Types.FilterFragmentFragment;
    filterOptions: FilterOptions;
  }>
> => {
  const source = await ensureSource(service, eventType, inputs);
  const sourceGroup = await ensureSourceGroup(service, eventType.name, [
    source.id,
  ]);

  switch (eventType.type) {
    case 'directPush': {
      const { filter, filterOptions } = getDirectPushFilter(
        source,
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
        source,
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
