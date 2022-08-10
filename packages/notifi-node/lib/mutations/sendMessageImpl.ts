import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

import type { WalletBlockchain } from '../types';

export type SendMessageInput = Readonly<{
  input: Readonly<{
    walletPublicKey: string;
    walletBlockchain: WalletBlockchain;
    messageKey: string;
    message: string;
    messageType: 'SIMPLE_HEALTH_THRESHOLD' | 'DIRECT_TENANT_MESSAGE';
  }>;
}>;

export type SendMessageResult = boolean;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation sendMessage($input: SendMessageInput) {
  sendMessage(sendMessageInput: $input)
}
`.trim();

const sendMessageImpl = makeAuthenticatedRequest<
  SendMessageInput,
  SendMessageResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'sendMessage');

export default sendMessageImpl;
