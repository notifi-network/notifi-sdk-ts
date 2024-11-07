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

  const login = async () => {
    await client.logIn({
      sid: TENANT_SID,
      secret: TENANT_SECRET,
    });
  };
});
