import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

export type SendMessageInput = Readonly<{
  input: Readonly<{
    walletPublicKey: string;
    walletBlockchain: 'SOLANA';
    message: string;
    messageType: 'SIMPLE_HEALTH_THRESHOLD';
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
