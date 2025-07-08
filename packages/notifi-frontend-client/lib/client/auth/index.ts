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

export interface BlockchainAuthStrategy {
  authenticate(params: SignMessageParams): Promise<AuthenticateResult>;
  prepareLoginWithWeb3(params: LoginWeb3Params): Promise<{
    signMessageParams: SignMessageParams;
    signingAddress: string;
    signingPubkey: string;
    nonce: string;
  }>;
}

export const CHAINS_WITH_LOGIN_WEB3 = [
  ...APTOS_BLOCKCHAINS,
  ...COSMOS_BLOCKCHAINS,
  ...SOLANA_BLOCKCHAINS,
  ...EVM_BLOCKCHAINS,
] as const;

type LoginWithWeb3Blockchain = {
  walletBlockchain: (typeof CHAINS_WITH_LOGIN_WEB3)[number];
};

export type LoginWeb3Params = Omit<
  Extract<SignMessageParams, LoginWithWeb3Blockchain>,
  'message' | 'nonce'
>;

export type LoginParams =
  | Exclude<SignMessageParams, LoginWithWeb3Blockchain>
  | LoginWeb3Params;

/** NOTE:
 * 1. Used for frontend client `login` related methods - requires only authentication method(s) to be passed in (w/o UserParams)
 * 2. TODO: refactor to combine all Uint8SignMessageFunction to a single case.
 */

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

// Const

export const SIGNING_MESSAGE_WITHOUT_NONCE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy.`;
export const SIGNING_MESSAGE = `${SIGNING_MESSAGE_WITHOUT_NONCE} \n \n 'Nonce:' `;

// Utils

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

// ⬇ TODO: Migrate to notifi-react

// /** NOTE:
//  * 1. Used for FrontendClientContext's props in `@notifi-network/notifi-react` - requires both authentication method(s) & UserParams to be passed in
//  * 2. Naming might look confusing as it is a legacy naming to avoid breaking changes
//  */

// type SolanaWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
//   isUsingHardwareWallet?: boolean;
//   hardwareLoginPlugin?: {
//     /**
//      * @deprecated Use signTransaction() instead. We no longer have to send a txn, and instead simply rely on the signed TX as we can verify this on Notifi Services.
//      */
//     sendMessage?: (message: string) => Promise<string>;
//     signTransaction: (message: string) => Promise<string>;
//   };
// }> &
//   SolanaUserParams;

// type AptosWalletWithSignParams = Readonly<{
//   signMessage: AptosSignMessageFunction;
// }> &
//   AptosUserParams;

// type BtcWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
// }> &
//   BtcUserParams;

// type CosmosWalletWithSignParams = Readonly<{
//   signMessage: CosmosSignMessageFunction;
// }> &
//   CosmosUserParams;

// type EvmWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
// }> &
//   EvmUserParams;

// type NearWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
// }> &
//   NearUserParams;

// type SuiWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
// }> &
//   SuiUserParams;

// type InjectiveWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
// }> &
//   InjectiveUserParams;

// type OffChainWalletWithSignParams = Readonly<{
//   signIn: OidcSignInFunction;
// }> &
//   OffChainUserParams;

// type UnmaintainedWalletWithSignParams = Readonly<{
//   signMessage: Uint8SignMessageFunction;
// }> &
//   UnmaintainedUserParams;

// export type WalletWithSignParams =
//   | SolanaWalletWithSignParams
//   | AptosWalletWithSignParams
//   | BtcWalletWithSignParams
//   | EvmWalletWithSignParams
//   | NearWalletWithSignParams
//   | SuiWalletWithSignParams
//   | OffChainWalletWithSignParams
//   | CosmosWalletWithSignParams
//   | InjectiveWalletWithSignParams
//   | UnmaintainedWalletWithSignParams;

// ⬇ TODO: Migrate to factory

/** NOTE:
 * 1. Used for instantiating client object (.instantiateFrontendClient) - requires only UserParams (w/o authentication method(s)) to be passed in
 * 2. Naming might look confusing with `WalletWithSignParams`(which is a legacy naming to avoid breaking changes)
 */
// export type UserParams =
//   | SolanaUserParams
//   | EvmUserParams
//   | AptosUserParams
//   | NearUserParams
//   | SuiUserParams
//   | CosmosUserParams
//   | OffChainUserParams
//   | UnmaintainedUserParams
//   | BtcUserParams
//   | InjectiveUserParams;
// export type SolanaUserParams = Readonly<{
//   walletBlockchain: 'SOLANA';
//   walletPublicKey: string;
// }>;

// export type AptosUserParams = Readonly<{
//   walletBlockchain: AptosBlockchain;
//   accountAddress: string;
//   walletPublicKey: string;
// }>;

// export type BtcUserParams = Readonly<{
//   walletBlockchain: BtcBlockchain;
//   accountAddress: string;
//   walletPublicKey: string;
// }>;

// export type EvmUserParams = Readonly<{
//   walletBlockchain: EvmBlockchain;
//   walletPublicKey: string;
// }>;

// export type InjectiveUserParams = Readonly<{
//   walletBlockchain: 'INJECTIVE';
//   accountAddress: string;
//   walletPublicKey: string;
// }>;

// export type CosmosUserParams =
//   | Readonly<{
//       walletBlockchain: CosmosBlockchain;
//       accountAddress: string;
//       walletPublicKey: string;
//     }>
//   | Readonly<{
//       walletBlockchain: CosmosBlockchain;
//       walletPublicKey: string;
//       signingAddress: string;
//       signingPubkey: string;
//     }>;

// export type UnmaintainedUserParams = Readonly<{
//   walletBlockchain: UnmaintainedBlockchain;
//   accountAddress: string;
//   walletPublicKey: string;
// }>;

// export type NearUserParams = Readonly<{
//   walletBlockchain: 'NEAR';
//   accountAddress: string;
//   walletPublicKey: string;
// }>;

// export type SuiUserParams = Readonly<{
//   walletBlockchain: 'SUI';
//   accountAddress: string;
//   walletPublicKey: string;
// }>;

// export type OffChainUserParams = Readonly<{
//   walletBlockchain: 'OFF_CHAIN';
//   userAccount: string;
// }>;

// ⬇ TODO: Remove this one
// export type ConnectWalletParams = Readonly<{
//   walletParams: WalletWithSignParams;
//   connectWalletConflictResolutionTechnique: Types.ConnectWalletInput['connectWalletConflictResolutionTechnique'];
// }>;
