import { FusionMessage } from '@notifi-network/notifi-dataplane';
import {
  NotifiNodeClient,
  createDataplaneClient,
  createGraphQLClient,
  createNotifiService,
  createNotifiSubscriptionService,
} from '@notifi-network/notifi-node';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import expect from 'expect';

config();
const FUSION_EVENT_ID = process.env.FUSION_EVENT_ID;
const TENANT_SECRET = process.env.TENANT_SECRET;
const TENANT_SID = process.env.TENANT_SID;
const WALLET_BLOCKCHAIN = 'ETHEREUM';

if (!FUSION_EVENT_ID || !TENANT_SECRET || !TENANT_SID)
  throw new Error('Missing environment variables');

describe('NotifiNodeClient Unit Test', () => {
  let client: NotifiNodeClient;

  beforeEach(() => {
    const graphqlClient = createGraphQLClient();
    const dpapiClient = createDataplaneClient();
    const subService = createNotifiSubscriptionService();
    const notifiService = createNotifiService(graphqlClient, subService);
    client = new NotifiNodeClient(notifiService, dpapiClient);
  });

  it('login', async () => {
    await login();
    const { status } = client.status;
    expect(status).toBe('initialized');
  });

  it('publishFusionMessage', async () => {
    await login();

    const fusionBroadcastMessage: FusionMessage = {
      eventTypeId: FUSION_EVENT_ID,
      variablesJson: {
        fromAddress: 'from-wallet-address',
        toAddress: 'to-wallet-address',
        amount: 'amount',
        currency: 'ETH',
        description: 'message-from-notifi-node',
      },
    };

    const fusionDirectMessage: FusionMessage = {
      ...fusionBroadcastMessage,
      specificWallets: [
        {
          walletBlockchain: WALLET_BLOCKCHAIN,
          walletPublicKey: getRandomEvmPublicKey(),
        },
      ],
    };

    const { indexToResultIdMap } = await client.publishFusionMessage([
      fusionBroadcastMessage,
      fusionDirectMessage,
    ]);

    expect(indexToResultIdMap).toBeDefined();
  });

  it('createTenantUser', async () => {
    await login();
    const result = await client.createTenantUser({
      walletBlockchain: WALLET_BLOCKCHAIN,
      walletPublicKey: getRandomEvmPublicKey(),
    });
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });

  it('getTenantConnectedWallets', async () => {
    await login();
    const result = await client.getTenantConnectedWallet({});
    expect(result).toHaveProperty('pageInfo');
    expect(result).toHaveProperty('nodes');
  });

  it('getActiveAlerts', async () => {
    await login();
    const result = await client.getActiveAlerts({
      fusionEventId: FUSION_EVENT_ID,
    });
    expect(result).toHaveProperty('pageInfo');
    expect(result).toHaveProperty('nodes');
  });

  // ⬇ Internal helper functions

  const getRandomEvmPublicKey = () => {
    return ethers.Wallet.createRandom().address;
  };

  const login = async () => {
    await client.logIn({
      sid: TENANT_SID,
      secret: TENANT_SECRET,
    });
  };
});
