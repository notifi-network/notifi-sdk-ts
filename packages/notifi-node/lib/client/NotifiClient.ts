import {
  deleteUserAlertImpl,
  logInFromServiceImpl,
  sendMessageImpl,
} from '../mutations';
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
      key: string;
      walletPublicKey: string;
      walletBlockchain: 'SOLANA';
      healthValue: number;
    }>,
  ) => Promise<void> = async (
    jwt,
    { key, walletPublicKey, walletBlockchain, healthValue },
  ) => {
    const message = newSimpleHealthThresholdMessage({ healthValue });
    const input = {
      walletPublicKey,
      walletBlockchain,
      messageKey: key,
      messageType: message.type,
      message: JSON.stringify(message.payload),
    };
    const result = await sendMessageImpl(this.a, jwt, { input });
    if (!result) {
      throw new Error('Send message failed');
    }
  };

  deleteUserAlert: (
    jwt: string,
    params: Readonly<{
      alertId: string;
    }>,
  ) => Promise<string /* AlertID */> = async (jwt, { alertId }) => {
    await deleteUserAlertImpl(this.a, jwt, { alertId });
    return alertId;
  };
}

export default NotifiClient;
