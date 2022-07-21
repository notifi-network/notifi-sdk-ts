import { Operation, Source } from '../models';

/**
 * Input param for creating a Source
 *
 * @remarks
 * This describes the values to use for Source
 *
 * @property name - Unique friendly name of Source
 * @property blockchainAddress - The Source blockchain address where events are coming from
 * @property type - The Source type of blockchainAddress
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type CreateSourceInput = Readonly<{
  name: string;
  blockchainAddress: string;
  type:
    | 'SOLANA_WALLET'
    | 'TERRA_WALLET'
    | 'ETHEREUM_WALLET'
    | 'TRIBECA_PROPOSALS'
    | 'REALM_PROPOSALS'
    | 'DIRECT_PUSH'
    | 'SOLANA_METAPLEX_AUCTION'
    | 'SOLANA_BONFIDA_AUCTION'
    | 'DIRECT_PUBLISH'
    | 'HEDGE_PROTOCOL'
    | 'BROADCAST'
    | 'SHARKY_PROTOCOL'
    | 'PORT_FINANCE'
    | 'METAPLEX_AUCTION_HOUSE'
    | 'ORCA';
}>;

export type CreateSourceResult = Source;

export type CreateSourceService = Readonly<{
  createSource: Operation<CreateSourceInput, CreateSourceResult>;
}>;
