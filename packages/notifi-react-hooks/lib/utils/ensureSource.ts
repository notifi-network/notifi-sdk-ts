import type {
  ClientCreateBonfidaAuctionSourceInput,
  ClientCreateMetaplexAuctionSourceInput,
  CreateSourceService,
} from '@notifi-network/notifi-core';
import { Types } from '@notifi-network/notifi-graphql';

export type CreateFunc<Service, T> = (
  service: Service,
  value: string,
) => Promise<T>;
export type IdentifyFunc<T> = (arg: T) => string | null;
export type ValueTransformFunc = (value: string) => string;

const ensureSource = async (
  service: CreateSourceService,
  existing: Types.Source[],
  input: Types.CreateSourceInput,
): Promise<Types.Source> => {
  const found = existing.find((it) => input.name === it.name);
  if (found !== undefined) {
    return found;
  }

  const newSource = await service.createSource(input);
  existing.push(newSource);

  return newSource;
};

const ensureBonfidaAuctionSource = async (
  service: CreateSourceService,
  existing: Types.Source[],
  input: ClientCreateBonfidaAuctionSourceInput,
): Promise<Types.Source> => {
  const { auctionAddressBase58, auctionName } = input;
  const underlyingAddress = `${auctionName}:;:${auctionAddressBase58}`;

  return await ensureSource(service, existing, {
    name: auctionAddressBase58,
    blockchainAddress: underlyingAddress,
    type: 'SOLANA_BONFIDA_AUCTION',
  });
};

const ensureMetaplexAuctionSource = async (
  service: CreateSourceService,
  existing: Types.Source[],
  input: ClientCreateMetaplexAuctionSourceInput,
): Promise<Types.Source> => {
  const { auctionAddressBase58, auctionWebUrl } = input;
  const underlyingAddress = `${auctionWebUrl}:;:${auctionAddressBase58}`;

  return await ensureSource(service, existing, {
    name: auctionAddressBase58,
    blockchainAddress: underlyingAddress,
    type: 'SOLANA_METAPLEX_AUCTION',
  });
};

export { ensureBonfidaAuctionSource, ensureMetaplexAuctionSource };

export default ensureSource;
