import { Types } from '@notifi-network/notifi-graphql';

/**
 * Target object for Web3Target
 *
 * @remarks
 * Target object for Webhook
 *
 * @property {string} id - Id of the WebhookTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 * @property {WalletBlockchain} walletBlockchain - blockchain the wallet is ion
 * @property {Web3TargetProtocol} targetProtocol - The protocol for the web3 target
 *
 */
export type Web3Target = Types.Web3Target;
