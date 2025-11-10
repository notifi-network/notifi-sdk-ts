import { arrayify } from '@ethersproject/bytes';
import {
  NotifiFrontendClient,
  type UserParams,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { ethers } from 'ethers';
import expect from 'expect';

import { dappAddress, getCardId, getEvmConnectedWallet } from './constants';

describe('NotifiFrontendClient Unit Test', () => {
  const walletBlockchain = 'ETHEREUM';
  let client: NotifiFrontendClient;
  let wallet: ethers.HDNodeWallet;

  beforeEach(() => {
    wallet = getEvmConnectedWallet();
    const evmUserParams: UserParams = {
      walletBlockchain: walletBlockchain,
      walletPublicKey: wallet.address,
    };
    client = instantiateFrontendClient(
      dappAddress,
      evmUserParams,
      'Production',
      {
        /* ⬇ explicitly specify 'InMemory' driverType as Nodejs environment does not have 'localStorage' (default option) */
        driverType: 'InMemory',
      },
    );
    // Sleep 1 second to avoid rate limiting issues
    return new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it('login', async () => {
    await login();
    expect(client.auth.userState?.status).toBe('authenticated');
  });

  it('fetchTenantConfig (V1 & V2)', async () => {
    await login();
    for (const version of ['v1', 'v2'] as const) {
      const cardId = getCardId(version);

      const result = await client.fetchTenantConfig({
        id: cardId,
        type: 'SUBSCRIPTION_CARD',
      });
      expect(result).toHaveProperty('cardConfig');
      expect(result.cardConfig).toHaveProperty('name');
      expect(result.cardConfig).toHaveProperty('version');
      expect(result.cardConfig.id).toBe(cardId);
      expect(result.cardConfig.version).toBe(version);
    }
  });

  it('fetchFusionData', async () => {
    await login();
    const result = await client.fetchFusionData();
    expect(result).toHaveProperty('alert');
  });

  it('getTargetGroups', async () => {
    await login();
    const result = await client.getTargetGroups();
    expect(result).toBeInstanceOf(Array);

    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('name');
    expect(result[0].name).toBe('Default');
  });

  it('alterTargetGroup-email', async () => {
    await login();
    const result = await client.alterTargetGroup({
      name: 'Default',
      email: {
        type: 'ensure',
        name: 'tester@notifi.network',
      },
    });
    expect(result).toHaveProperty('name');
    expect(result.name).toBe('Default');
    expect(result).toHaveProperty('emailTargets');
    expect(result.emailTargets?.length).toBe(1);
    expect(result.emailTargets![0]!.emailAddress).toBe('tester@notifi.network');
  });

  it('alterTargetGroup-sms', async () => {
    await login();
    const result = await client.alterTargetGroup({
      name: 'Default',
      phoneNumber: {
        type: 'ensure',
        name: '+18882378289',
      },
    });

    expect(result).toHaveProperty('name');
    expect(result.name).toBe('Default');
    expect(result.smsTargets?.length).toBe(1);
    expect(result.smsTargets![0]!.phoneNumber).toBe('+18882378289');
  });

  it('ensureFusionAlerts & deleteAlerts & getAlerts', async () => {
    await login();

    const targetGroups = await client.getTargetGroups();
    const defaultTargetGroup = targetGroups.find((tg) => tg.name === 'Default');
    if (!defaultTargetGroup) {
      throw new Error('Default target group not found');
    }
    const alert: Types.CreateFusionAlertInput = {
      fusionEventId: '019301438fb877a3b5bcef55a6cac916',
      name: 'Test Alert',
      subscriptionValue: '*',
      targetGroupId: defaultTargetGroup.id,
    };

    // Ensure alert
    const result = await client.ensureFusionAlerts({
      alerts: [alert],
    });
    expect(result).toHaveProperty('alerts');
    expect(result.alerts!.length).toBe(1);
    expect(result.alerts![0].name).toBe('Test Alert');
    const alertId = result.alerts![0].id;

    // Delete alert
    await client.deleteAlerts({ ids: [alertId] });

    // Get alerts
    const alerts = await client.getAlerts();
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.length).toBe(0);
  });

  it('getFusionNotificationHistory', async () => {
    await login();
    const result = await client.getFusionNotificationHistory({});
    expect(result).toHaveProperty('pageInfo');
    expect(result).toHaveProperty('nodes');
  });

  it('getUserSettings & updateUserSettings', async () => {
    await login();

    // Get user settings
    const result = await client.getUserSettings();
    expect(result).toHaveProperty('ftuStage');
    expect(result?.ftuStage).toBeNull();

    // Update user settings
    const { updateUserSettings } = await client.updateUserSettings({
      input: { ftuStage: 1 },
    });
    expect(updateUserSettings).toHaveProperty('ftuStage');
    expect(updateUserSettings?.ftuStage).toBe(1);
  });

  it('addEventListener - target state change', async () => {
    await login();

    const eventHandler = (evt: Types.StateChangedEvent) => {
      expect(evt).toHaveProperty('__typename');
      expect(
        /* History changed event will also be emitted when creating a email target for email verification system event */
        evt.__typename === 'TargetStateChangedEvent' ||
          evt.__typename === 'NotificationHistoryStateChangedEvent',
      ).toBeTruthy();
    };

    const errorHandler = (error: unknown) => {
      if (error) throw error;
    };

    const id = client.addEventListener(
      'stateChanged',
      eventHandler,
      errorHandler,
    );

    expect(id).toBeDefined();

    await client.alterTargetGroup({
      name: 'Default',
      // Utilize sms target instead of email target to reduce overhead of emitting fusion event (system messsage)
      phoneNumber: {
        type: 'ensure',
        name: '+18882378289',
      },
    });

    client.removeEventListener('stateChanged', id);
  });

  // ⬇ Internal helper functions
  const login = async () => {
    return client.auth.logIn({
      signMessage: async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      },
      walletBlockchain,
    });
  };
});
