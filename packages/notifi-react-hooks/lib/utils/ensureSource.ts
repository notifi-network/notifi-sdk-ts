import type {
  ClientCreateMetaplexAuctionSourceInput,
  CreateSourceService,
  CreateSourceInput,
  Source,
} from '@notifi-network/notifi-core';

export type CreateFunc<Service, T> = (
  service: Service,
  value: string,
) => Promise<T>;
export type IdentifyFunc<T> = (arg: T) => string | null;
export type ValueTransformFunc = (value: string) => string;

const ensureSource = async (
  service: CreateSourceService,
  existing: Source[],
  input: CreateSourceInput,
): Promise<Source> => {
  
  const found = existing.find(
    it => input.blockchainAddress === it.blockchainAddress
    && input.type === it.type
  );
  if (found !== undefined)
  {
    return found;
  }

  const newSource =  await service.createSource(input);
  existing.push(newSource);

  return newSource;
}

const ensureMetaplexAuctionSource = async (
  service: CreateSourceService,
  existing: Source[],
  input: ClientCreateMetaplexAuctionSourceInput
  ): Promise<Source> => {
  const { auctionAddressBase58, auctionWebUrl } = input;
  const underlyingAddress = `${auctionWebUrl}:;:${auctionAddressBase58}`;

  return await ensureSource(service, existing, {
    name: auctionAddressBase58,
    blockchainAddress: underlyingAddress,
    type: 'SOLANA_METAPLEX_AUCTION'
  });
}

export { ensureMetaplexAuctionSource };

export default ensureSource;
