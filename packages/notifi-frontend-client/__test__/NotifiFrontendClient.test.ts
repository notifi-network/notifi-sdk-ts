import { arrayify } from '@ethersproject/bytes';
import {
  EvmUserParams,
  NotifiFrontendClient,
  envUrl,
  instantiateFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { ethers } from 'ethers';
import expect from 'expect';

describe('NotifiFrontendClient Unit Test', () => {
  let client: NotifiFrontendClient;

  let wallet: ethers.HDNodeWallet;

  beforeEach(() => {
    wallet = getConnectedWallet();
    const evmUserParams: EvmUserParams = {
      walletBlockchain: walletBlockchain,
      walletPublicKey: wallet.address,
    };
    client = instantiateFrontendClient(dappAddress, evmUserParams, env, {
      // TODO: inline document
      driverType: 'InMemory',
    });
  });

  it('login', async () => {
    await login();
    expect(client.userState?.status).toBe('authenticated');
  });

  it('fetchTenantConfig', async () => {
    await login();
    const result = await client.fetchTenantConfig({
      id: cardId,
      type: 'SUBSCRIPTION_CARD',
    });
    expect(result).toHaveProperty('cardConfig');
    expect(result.cardConfig).toHaveProperty('name');
    expect(result.cardConfig.id).toBe(cardId);
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

  it('ensureTargetGroup-email', async () => {
    await login();
    const result = await client.ensureTargetGroup({
      name: 'Default',
      emailAddress: 'tester@notifi.network',
    });
    expect(result).toHaveProperty('name');
    expect(result.name).toBe('Default');
    expect(result).toHaveProperty('emailTargets');
    expect(result.emailTargets?.length).toBe(1);
    expect(result.emailTargets![0]!.emailAddress).toBe('tester@notifi.network');
  });

  it('ensureFusionAlerts & deleteAlert & getAlerts', async () => {
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
    await client.deleteAlert({ id: alertId });

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

  // ⬇ Internal helper functions
  const login = async () => {
    return client.logIn({
      signMessage: async (message: Uint8Array) => {
        const signature = await wallet.signMessage(message);
        return arrayify(signature);
      },
      walletBlockchain,
    });
  };
});

// Utils & Constants
const env = 'Production';
const dappAddress = 'xdjczkhmgann9g24871z';
const cardId = '019305821e1772c1b3b8d07df1d724ee';
const walletBlockchain = 'ETHEREUM';

const getConnectedWallet = () => {
  const _wallet = ethers.Wallet.createRandom();
  _wallet.connect(new ethers.JsonRpcProvider(envUrl(env)));
  return _wallet;
};
