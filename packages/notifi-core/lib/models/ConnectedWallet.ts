import { Types } from '@notifi-network/notifi-graphql';

/**
 * Object describing a ConnectedWallet
 *
 * @remarks
 * Object describing a ConnectedWallet
 *
 * @property {string | null} address - the address associated with the wallet
 * @property {string} walletBlockchain - the blockchain associated with the wallet
 *
 */
export type ConnectedWallet = Types.ConnectedWalletFragmentFragment;
