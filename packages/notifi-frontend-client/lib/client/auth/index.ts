import { NotifiService, Types } from '@notifi-network/notifi-graphql';
import { NotifiFrontendConfiguration } from 'notifi-frontend-client/lib/configuration';
import {
  APTOS_BLOCKCHAINS,
  BtcBlockchain,
  COSMOS_BLOCKCHAINS,
  EVM_BLOCKCHAINS,
  SOLANA_BLOCKCHAINS,
  UnmaintainedBlockchain,
} from 'notifi-frontend-client/lib/models';

import { AptosSignMessageParams } from './AptosAuthStrategy';
import { CosmosSignMessageParams } from './CosmosAuthStrategy';
import { EvmSignMessageParams } from './EvmAuthStrategy';
import { SolanaSignMessageParams } from './SolanaAuthStrategy';

export * from './AuthManager';

// ─── Constants ───────────────────────────────────────────────

export const SIGNING_MESSAGE_WITHOUT_NONCE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy.`;
export const SIGNING_MESSAGE = `${SIGNING_MESSAGE_WITHOUT_NONCE} \n \n 'Nonce:' `;

export const CHAINS_WITH_LOGIN_WEB3 = [
  ...APTOS_BLOCKCHAINS,
  ...COSMOS_BLOCKCHAINS,
  ...SOLANA_BLOCKCHAINS,
  ...EVM_BLOCKCHAINS,
] as const;

// ─── Types ────────────────────────────────────────────────────

export interface BlockchainAuthStrategy {
  authenticate(params: SignMessageParams): Promise<AuthenticateResult>;
  prepareLoginWithWeb3(params: LoginWeb3Params): Promise<{
    signMessageParams: SignMessageParams;
    signingAddress: string;
    signingPubkey: string;
    nonce: string;
  }>;
}

export type LoginParams =
  | Exclude<SignMessageParams, LoginWithWeb3Blockchain>
  | LoginWeb3Params;

type LoginWithWeb3Blockchain = {
  walletBlockchain: (typeof CHAINS_WITH_LOGIN_WEB3)[number];
};

export type LoginWeb3Params = Omit<
  Extract<SignMessageParams, LoginWithWeb3Blockchain>,
  'message' | 'nonce'
>;

export type SignMessageParams =
  | CosmosSignMessageParams
  | BtcSignMessageParams
  | EvmSignMessageParams
  | AptosSignMessageParams
  | SolanaSignMessageParams
  | UnmaintainedSignMessageParams
  | Readonly<{
      walletBlockchain: 'NEAR';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'OFF_CHAIN';
      signIn: OidcSignInFunction;
    }>
  | Readonly<{
      walletBlockchain: 'INJECTIVE';
      signMessage: Uint8SignMessageFunction;
    }>;

// TODO: add message here when we migrate to loginwithweb3...
type BtcSignMessageParams = Readonly<{
  walletBlockchain: BtcBlockchain;
  signMessage: Uint8SignMessageFunction;
}>;

type UnmaintainedSignMessageParams = Readonly<{
  walletBlockchain: UnmaintainedBlockchain;
  signMessage: Uint8SignMessageFunction;
}>;

export type Uint8SignMessageFunction = (
  message: Uint8Array,
) => Promise<Uint8Array>;

export type OidcCredentials = {
  oidcProvider: Types.OidcProvider;
  jwt: string;
};

export type AuthenticateResult = SignMessageResult | OidcCredentials;
export type OidcSignInFunction = () => Promise<OidcCredentials>;
export type SignMessageResult = { signature: string; signedMessage: string };

type BeginLoginWithWeb3Props = Omit<
  Types.BeginLogInWithWeb3Input,
  'dappAddress' | 'blockchainType'
>;

// ─── Utils ────────────────────────────────────────────────────

export const beginLogInWithWeb3 = async (
  params: BeginLoginWithWeb3Props & {
    service: NotifiService;
    config: NotifiFrontendConfiguration;
  },
): Promise<Types.BeginLogInWithWeb3Response> => {
  const { service, config, authType, authAddress, walletPubkey } = params;
  const { tenantId, walletBlockchain } = config;

  const result = await service.beginLogInWithWeb3({
    dappAddress: tenantId,
    authAddress,
    blockchainType: walletBlockchain,
    authType,
    walletPubkey,
  });

  if (!result.beginLogInWithWeb3.beginLogInWithWeb3Response) {
    throw new Error('Failed to begin login process');
  }

  return result.beginLogInWithWeb3.beginLogInWithWeb3Response;
};
