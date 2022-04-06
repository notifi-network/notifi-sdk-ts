import type { ManagedAlert, WalletBlockchain } from '../mutations';
import {
  createDirectPushAlertImpl,
  createTenantUserImpl,
  deleteDirectPushAlertImpl,
  deleteUserAlertImpl,
  logInFromServiceImpl,
  sendMessageImpl,
} from '../mutations';
import {
  Authorization,
  newDirectTenantMessage,
  newSimpleHealthThresholdMessage,
} from '../types';
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
      walletBlockchain: WalletBlockchain;
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

  sendDirectPush: (
    jwt: string,
    params: Readonly<{
      key: string;
      walletPublicKey: string;
      walletBlockchain: WalletBlockchain;
      message?: string;
      template?: {
        emailTemplate?: string;
        smsTemplate?: string;
        telegramTemplate?: string;
        variables: Record<string, string>;
      };
    }>,
  ) => Promise<void> = async (
    jwt,
    { key, walletPublicKey, walletBlockchain, message, template },
  ) => {
    let directMessage;
    if (message !== undefined) {
      directMessage = newDirectTenantMessage({ message });
    } else if (template !== undefined) {
      directMessage = newDirectTenantMessage({
        message: '',
        targetTemplates: {
          SMS: template.smsTemplate ?? undefined,
          Email: template.emailTemplate ?? undefined,
          Telegram: template.telegramTemplate ?? undefined,
        },
        templateVariables: template.variables,
      });
    } else {
      throw new Error('One of message or template must be set');
    }

    const input = {
      walletPublicKey,
      walletBlockchain,
      messageKey: key,
      messageType: directMessage.type,
      message: JSON.stringify(directMessage.payload),
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

  createTenantUser: (
    jwt: string,
    params: Readonly<{
      walletBlockchain: WalletBlockchain;
      walletPublicKey: string;
    }>,
  ) => Promise<string /* UserID */> = async (
    jwt,
    { walletBlockchain, walletPublicKey },
  ) => {
    const result = await createTenantUserImpl(this.a, jwt, {
      input: { walletBlockchain, walletPublicKey },
    });

    return result.id;
  };

  createDirectPushAlert: (
    jwt: string,
    params: Readonly<{
      userId: string;
      emailAddresses?: ReadonlyArray<string>;
      phoneNumbers?: ReadonlyArray<string>;
    }>,
  ) => Promise<ManagedAlert> = async (
    jwt,
    { userId, emailAddresses, phoneNumbers },
  ) => {
    const input = {
      userId,
      emailAddresses: emailAddresses ?? [],
      phoneNumbers: phoneNumbers ?? [],
    };
    return await createDirectPushAlertImpl(this.a, jwt, {
      input,
    });
  };

  deleteDirectPushAlert: (
    jwt: string,
    params: Readonly<{
      alertId: string;
    }>,
  ) => Promise<ManagedAlert> = async (jwt, { alertId }) => {
    const input = { alertId };
    return await deleteDirectPushAlertImpl(this.a, jwt, { input });
  };
}

export default NotifiClient;
