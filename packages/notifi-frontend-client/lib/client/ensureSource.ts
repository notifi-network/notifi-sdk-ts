import type { Operations, Types } from '@notifi-network/notifi-graphql';
import { SourceGroupFragmentFragment } from 'notifi-graphql/lib/gql/generated';

export type EnsureSourceParams =
  | Readonly<{
      type: 'SOLANA_BONFIDA_AUCTION';
      auctionAddressBase58: string;
      auctionName: string;
    }>
  | Readonly<{
      type: 'SOLANA_METAPLEX_AUCTION';
      auctionAddressBase58: string;
      auctionWebUrl: string;
    }>
  | Readonly<{
      type: Exclude<
        Types.SourceType,
        'SOLANA_BONFIDA_AUCTION' | 'SOLANA_METAPLEX_AUCTION'
      >;
      name: string;
      blockchainAddress: string;
    }>;

export const ensureSource = async (
  service: Operations.CreateSourceService & Operations.GetSourcesService,
  input: EnsureSourceParams,
): Promise<Types.SourceFragmentFragment> => {
  switch (input.type) {
    case 'SOLANA_BONFIDA_AUCTION':
      return ensureBonfidaAuctionSource(service, input);
    case 'SOLANA_METAPLEX_AUCTION':
      return ensureMetaplexAuctionSource(service, input);
    default:
      return ensureSourceRaw(service, input);
  }
};

export const ensureSourceRaw = async (
  service: Operations.CreateSourceService & Operations.GetSourcesService,
  input: Types.CreateSourceMutationVariables,
): Promise<Types.SourceFragmentFragment> => {
  const query = await service.getSources({});
  const existing = query.source;
  if (existing === undefined) {
    throw new Error('Failed to fetch sources');
  }

  const found = existing.find((it) => input.name === it?.name);
  if (found !== undefined) {
    return found;
  }

  const mutation = await service.createSource(input);
  const created = mutation.createSource;
  if (created === undefined) {
    throw new Error('Failed to create source');
  }

  return created;
};

export const ensureBonfidaAuctionSource = async (
  service: Operations.CreateSourceService & Operations.GetSourcesService,
  input: Readonly<{
    auctionAddressBase58: string;
    auctionName: string;
  }>,
): Promise<Types.SourceFragmentFragment> => {
  const { auctionAddressBase58, auctionName } = input;
  const underlyingAddress = `${auctionName}:;:${auctionAddressBase58}`;

  return await ensureSourceRaw(service, {
    name: auctionAddressBase58,
    blockchainAddress: underlyingAddress,
    type: 'SOLANA_BONFIDA_AUCTION',
  });
};

export const ensureMetaplexAuctionSource = async (
  service: Operations.CreateSourceService & Operations.GetSourcesService,
  input: Readonly<{
    auctionAddressBase58: string;
    auctionWebUrl: string;
  }>,
): Promise<Types.SourceFragmentFragment> => {
  const { auctionAddressBase58, auctionWebUrl } = input;
  const underlyingAddress = `${auctionWebUrl}:;:${auctionAddressBase58}`;

  return await ensureSourceRaw(service, {
    name: auctionAddressBase58,
    blockchainAddress: underlyingAddress,
    type: 'SOLANA_METAPLEX_AUCTION',
  });
};

const ensureSourceIds = async (
  service: Operations.GetSourcesService & Operations.CreateSourceService,
  sourceParams: ReadonlyArray<EnsureSourceParams>,
): Promise<Set<string>> => {
  const sourceIds: Set<string> = new Set();
  // Create sources in series
  for (let i = 0; i < sourceParams.length; ++i) {
    const params = sourceParams[i];
    const source = await ensureSource(service, params);
    sourceIds.add(source.id);
  }

  return sourceIds;
};

const updateSourceGroup = async (
  service: Operations.UpdateSourceGroupService &
    Operations.GetSourcesService &
    Operations.CreateSourceService,
  existing: Types.SourceGroupFragmentFragment,
  sourceParams: ReadonlyArray<EnsureSourceParams>,
) => {
  const sourceIds = await ensureSourceIds(service, sourceParams);
  const existingSources = existing.sources ?? [];
  if (
    existingSources.length === sourceIds.size &&
    existingSources.every((it) => it !== undefined && sourceIds.has(it.id))
  ) {
    return existing;
  }

  const mutation = await service.updateSourceGroup({
    id: existing.id,
    name: existing.name ?? existing.id,
    sourceIds: [...sourceIds.keys()],
  });

  const updated = mutation.updateSourceGroup;
  if (updated === undefined) {
    throw new Error('Failed to update source group');
  }

  return updated;
};

const createSourceGroup = async (
  service: Operations.CreateSourceGroupService &
    Operations.GetSourcesService &
    Operations.CreateSourceService,
  name: string,
  sourceParams: ReadonlyArray<EnsureSourceParams>,
) => {
  const sourceIds = await ensureSourceIds(service, sourceParams);
  const mutation = await service.createSourceGroup({
    name,
    sourceIds: [...sourceIds.keys()],
  });

  const created = mutation.createSourceGroup;
  if (created === undefined) {
    throw new Error('Failed to create source group');
  }

  return created;
};

export const ensureSourceGroup = async (
  service: Operations.CreateSourceGroupService &
    Operations.UpdateSourceGroupService &
    Operations.GetSourceGroupsService &
    Operations.GetSourcesService &
    Operations.CreateSourceService,
  input: Readonly<{
    name: string;
    sourceParams: ReadonlyArray<EnsureSourceParams>;
  }>,
): Promise<SourceGroupFragmentFragment> => {
  const query = await service.getSourceGroups({});
  const sourceGroups = query.sourceGroup;
  if (sourceGroups === undefined) {
    throw new Error('Failed to fetch source groups');
  }

  const existing = sourceGroups.find((it) => it?.name === input.name);
  if (existing !== undefined) {
    return updateSourceGroup(service, existing, input.sourceParams);
  }

  return createSourceGroup(service, input.name, input.sourceParams);
};
