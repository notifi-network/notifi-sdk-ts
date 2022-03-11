import { logInFromServiceImpl, sendMessageImpl } from '../mutations';
import { Authorization, newSimpleHealthThresholdMessage } from '../types';
import type { AxiosPost } from '@notifi-network/notifi-axios-utils';

class NotifiClient {
  constructor(private a: AxiosPost) {}

  logIn: (
    params: Readonly<{
      sid: string;
      secret: string;
    }>,
  ) => Promise<Authorization> = async ({ sid, secret }) => {
    const input = { sid, secret };
    return await logInFromServiceImpl(this.a, { input });
  };

  sendSimpleHealthThreshold: (
    jwt: string,
    params: Readonly<{
      walletPublicKey: string;
      walletBlockchain: 'SOLANA';
      value: number;
    }>,
  ) => Promise<void> = async (
    jwt,
    { walletPublicKey, walletBlockchain, value },
  ) => {
    const message = newSimpleHealthThresholdMessage({ value });
    const input = {
      walletPublicKey,
      walletBlockchain,
      messageType: message.type,
      message: JSON.stringify(message.payload),
    };
    const result = await sendMessageImpl(this.a, jwt, { input });
    if (!result) {
      throw new Error('Send message failed');
    }
  };
}

export default NotifiClient;
