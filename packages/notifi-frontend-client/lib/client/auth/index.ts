import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import { NotifiFrontendConfiguration } from '../../configuration';
import {
  APTOS_BLOCKCHAINS,
  type BtcBlockchain,
  COSMOS_BLOCKCHAINS,
  EVM_BLOCKCHAINS,
  SOLANA_BLOCKCHAINS,
  SUI_BLOCKCHAINS,
  type UnmaintainedBlockchain,
  isAptosBlockchain,
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
  isSuiBlockchain,
} from '../../models';
import {
  AptosAuthStrategy,
  type AptosSignMessageParams,
} from './AptosAuthStrategy';
import {
  CosmosAuthStrategy,
  type CosmosSignMessageParams,
} from './CosmosAuthStrategy';
import { EvmAuthStrategy, type EvmSignMessageParams } from './EvmAuthStrategy';
import {
  SolanaAuthStrategy,
  type SolanaSignMessageParams,
} from './SolanaAuthStrategy';
import { SuiAuthStrategy, SuiSignMessageParams } from './SuiAuthStrategy';

export * from './AuthManager';

// ─── Constants ───────────────────────────────────────────────

export const SIGNING_MESSAGE_WITHOUT_NONCE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy.`;
export const SIGNING_MESSAGE = `${SIGNING_MESSAGE_WITHOUT_NONCE} \n \n 'Nonce:' `;

export const CHAINS_WITH_LOGIN_WEB3 = [
  ...APTOS_BLOCKCHAINS,
  ...COSMOS_BLOCKCHAINS,
  ...SOLANA_BLOCKCHAINS,
  ...EVM_BLOCKCHAINS,
  ...SUI_BLOCKCHAINS,
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

/* NOTE: ⬇ AuthManager.logIn argument type - LoginParams */
export type LoginParams =
  | LoginWeb3Params
  | Exclude<SignMessageParams, LoginWeb3Params['walletBlockchain']>;

export type LoginWeb3Params = CleanedLoginWeb3Params<SignMessageParams>;

type CleanedLoginWeb3Params<T> = T extends {
  walletBlockchain: (typeof CHAINS_WITH_LOGIN_WEB3)[number];
}
  ? Omit<T, 'nonce' | 'message'>
  : never;

export type SignMessageParams =
  | CosmosSignMessageParams
  | BtcSignMessageParams
  | EvmSignMessageParams
  | AptosSignMessageParams
  | SolanaSignMessageParams
  | SuiSignMessageParams
  | NearSignMessageParams
  | InjectiveSignMessageParams
  | OffChainSignMessageParams
  | UnmaintainedSignMessageParams;

/* NOTE: ⬇ Chains either under migration list or do not support web3 login flow */
type BtcSignMessageParams = Readonly<{
  walletBlockchain: BtcBlockchain;
  signMessage: Uint8SignMessageFunction;
}>;

type NearSignMessageParams = Readonly<{
  walletBlockchain: 'NEAR';
  signMessage: Uint8SignMessageFunction;
}>;

type InjectiveSignMessageParams = Readonly<{
  walletBlockchain: 'INJECTIVE';
  signMessage: Uint8SignMessageFunction;
}>;

type OffChainSignMessageParams = Readonly<{
  walletBlockchain: 'OFF_CHAIN';
  signIn: OidcSignInFunction;
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

export const isLoginWeb3Params = (
  params: LoginParams,
): params is LoginWeb3Params => {
  return CHAINS_WITH_LOGIN_WEB3.includes(
    params.walletBlockchain as (typeof CHAINS_WITH_LOGIN_WEB3)[number],
  );
};

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

export const getStrategyForBlockchain = (
  blockchain: Types.BlockchainType,
  service: NotifiService,
  config: NotifiFrontendConfiguration,
): BlockchainAuthStrategy => {
  if (isCosmosBlockchain(blockchain)) {
    return new CosmosAuthStrategy(service, config);
  }
  if (isAptosBlockchain(blockchain)) {
    return new AptosAuthStrategy(service, config);
  }
  if (isSolanaBlockchain(blockchain)) {
    return new SolanaAuthStrategy(service, config);
  }
  if (isEvmBlockchain(blockchain)) {
    return new EvmAuthStrategy(service, config);
  }
  if (isSuiBlockchain(blockchain)) {
    return new SuiAuthStrategy(service, config);
  }
  throw new Error(
    `ERROR - getStrategyForBlockchain: Unsupported blockchain: ${blockchain}`,
  );
};
