import {
  NotifiSmartLinkClient,
  newSmartLinkClient,
} from '@notifi-network/notifi-frontend-client';
import expect from 'expect';

describe('Notifi SmartLink & Action Unit Tests', () => {
  beforeEach(() => {
    const currentTestName = expect.getState().currentTestName;
    console.info(`Starting test: ${currentTestName}`);
  });

  it('Fetch SmartLinkConfig', async () => {
    const client: NotifiSmartLinkClient = newSmartLinkClient({ env });
    const smartLinkConfig = await client.fetchSmartLinkConfig(smartLink);
    expect(smartLinkConfig).toHaveProperty('smartLinkConfig');
    expect(smartLinkConfig).toHaveProperty('isActive');
  });

  it('Activate SmartLinkAction', async () => {
    const client = newSmartLinkClient({
      env,
      authParams: { walletBlockchain: 'ETHEREUM', walletPublicKey: '0x0' },
    });
    const response = await client.activateSmartLinkAction({
      smartLinkId: smartLink,
      actionId: '1',
      inputs: {
        0: {
          id: '31264646-a318-486f-9877-cbe97e6a9411',
          type: 'TEXTBOX',
          value: '2',
        },
      },
    });
    expect(response).toHaveProperty('successMessage');
    expect(response).toHaveProperty('failureMessage');
    expect(response).toHaveProperty('transactions');
  });
});

// Utils & Constants (TODO: Move to a separate module when growing)
const env = 'Development'; // TODO: Update to production
const smartLink = '1302fc05485341eab8931e759cc0a08c'; // TODO: Update to production
