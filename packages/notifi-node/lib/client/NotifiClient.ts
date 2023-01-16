import type {
  Types as Gql,
  NotifiService,
} from '@notifi-network/notifi-graphql';

import type {
  Authorization,
  GetTenantConnectedWalletResult,
  GetTenantUserResult,
  ManagedAlert,
  SimpleHealthThresholdMessagePayload,
  WalletBlockchain,
} from '../types';
import {
  newDirectTenantMessage,
  newSimpleHealthThresholdMessage,
} from '../types';

class NotifiClient {
  constructor(private service: NotifiService) {}

  logIn: (
    input: Gql.LogInFromServiceMutationVariables['input'],
  ) => Promise<Authorization> = async (input) => {
    const results = await this.service.logInFromService({ input });
    const authorization = results.logInFromService;
    if (authorization === undefined) {
      throw new Error('Log in failed!');
    }
    return authorization;
  };

  sendSimpleHealthThreshold: (
    jwt: string,
    params: Readonly<{
      key: string;
      walletPublicKey: string;
      walletBlockchain: WalletBlockchain;
    }> &
      SimpleHealthThresholdMessagePayload,
  ) => Promise<void> = async (
    jwt,
    { key, walletPublicKey, walletBlockchain, ...payload },
  ) => {
    const message = newSimpleHealthThresholdMessage(payload);
    const input = {
      walletPublicKey,
      walletBlockchain,
      messageKey: key,
      messageType: message.type,
      message: JSON.stringify(message.payload),
    };

    this.service.setJwt(jwt);
    const result = await this.service.sendMessage({ input });
    if (!result.sendMessage) {
      throw new Error('Send message failed');
    }
  };

  sendBroadcastMessage: (
    jwt: string,
    params: Omit<
      Gql.BroadcastMessageMutationVariables,
      'timestamp' | 'walletBlockchain' | 'signature'
    >,
  ) => Promise<void> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.broadcastMessage({
      ...params,
      timestamp: 0,
      walletBlockchain: 'OFF_CHAIN',
      signature: '',
    });

    if (result.broadcastMessage?.id === undefined) {
      throw new Error('broadcast message failed');
    }
  };

  sendDirectPush: (
    jwt: string,
    params: Readonly<{
      key: string;
      walletPublicKey: string;
      walletBlockchain: WalletBlockchain;
      message?: string;
      type?: string;
      template?: {
        emailTemplate?: string;
        smsTemplate?: string;
        telegramTemplate?: string;
        variables: Record<string, string>;
      };
    }>,
  ) => Promise<void> = async (
    jwt,
    { key, walletPublicKey, walletBlockchain, message, template, type },
  ) => {
    let directMessage;
    if (message !== undefined) {
      directMessage = newDirectTenantMessage({ message, type });
    } else if (template !== undefined) {
      directMessage = newDirectTenantMessage({
        message: '',
        type,
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

    this.service.setJwt(jwt);
    const result = await this.service.sendMessage({
      input,
    });

    if (!result.sendMessage) {
      throw new Error('Send message failed');
    }
  };

  deleteUserAlert: (
    jwt: string,
    params: Gql.DeleteUserAlertMutationVariables,
  ) => Promise<string /* AlertID */> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.deleteUserAlert(params);
    const deletedId = result.deleteUserAlert?.id;
    if (deletedId === undefined) {
      throw new Error('Delete user alert failed');
    }
    return deletedId;
  };

  createTenantUser: (
    jwt: string,
    params: Gql.CreateTenantUserMutationVariables['input'],
  ) => Promise<string /* UserID */> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.createTenantUser({
      input,
    });

    const userId = result.createTenantUser?.id;
    if (userId === undefined) {
      throw new Error('Create tenant user failed');
    }

    return userId;
  };

  // TODO: Deprecate ManagedAlert type
  createDirectPushAlert: (
    jwt: string,
    params: Gql.CreateDirectPushAlertMutationVariables['input'],
  ) => Promise<ManagedAlert> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.createDirectPushAlert({
      input,
    });
    const alertId = result.createDirectPushAlert?.id;
    if (alertId === undefined) {
      throw new Error('Create direct push alert failed');
    }

    return {
      id: alertId,
    };
  };

  // TODO: Deprecate ManagedAlert type
  deleteDirectPushAlert: (
    jwt: string,
    params: Gql.DeleteDirectPushAlertMutationVariables['input'],
  ) => Promise<ManagedAlert> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.DeleteDirectPushAlert({ input });
    const alertId = result.deleteDirectPushAlert?.id;
    if (alertId === undefined) {
      throw new Error('Delete direct push alert failed');
    }

    return {
      id: alertId,
    };
  };

  getTenantConnectedWallet: (
    jwt: string,
    params: Gql.GetTenantConnectedWalletQueryVariables,
  ) => Promise<GetTenantConnectedWalletResult> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.getTenantConnectedWallets(params);
    const connection = result.tenantConnectedWallet;
    if (connection === undefined) {
      throw new Error('Get tenant connected wallet failed');
    }

    return connection;
  };

  getTenantUser: (
    jwt: string,
    params: Gql.GetTenantUserQueryVariables,
  ) => Promise<GetTenantUserResult> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.getTenantUser(params);
    const connection = result.tenantUser;
    if (connection === undefined) {
      throw new Error('Get tenant user failed');
    }

    return connection;
  };
}

export default NotifiClient;
