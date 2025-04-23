import {
  ActivateSmartLinkActionInput,
  SmartLinkActionUserInput,
} from '@notifi-network/notifi-dataplane';
import {
  AuthParams,
  NotifiEnvironment,
  NotifiSmartLinkClient,
  SmartLinkConfig,
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
      authParams,
    });
    const { smartLinkConfig } = await client.fetchSmartLinkConfig(smartLink);
    const activateSmartLinkActionInput = getFirstActionInput(
      smartLink,
      smartLinkConfig,
    );
    const response = await client.activateSmartLinkAction(
      activateSmartLinkActionInput,
    );
    expect(response).toHaveProperty('successMessage');
    expect(response).toHaveProperty('failureMessage');
    expect(response).toHaveProperty('transactions');
  });
});

// Utils & Constants (TODO: Move to a separate module when growing)
const env: NotifiEnvironment = 'Development'; // TODO: Update to production
const smartLink = '1302fc05485341eab8931e759cc0a08c'; // TODO: Update to production

const authParams: AuthParams = {
  walletBlockchain: 'ETHEREUM',
  walletPublicKey: '0x0',
};

/* Grab 1st Action and generate a valid user inputs */
const getFirstActionInput = (
  smartLinkId: string,
  smartLinkConfig: SmartLinkConfig,
): Omit<ActivateSmartLinkActionInput, 'authParams'> => {
  const smartLinkActions = smartLinkConfig.components.filter(
    (component) => component.type === 'ACTION',
  );
  const actionId = smartLinkActions[0].id;
  const inputs = smartLinkActions[0].inputs.reduce(
    (acc: Record<number, SmartLinkActionUserInput>, input, id) => {
      const userInput: SmartLinkActionUserInput =
        input.type === 'TEXTBOX'
          ? {
              type: 'TEXTBOX',
              value: '1',
              id: input.id,
            }
          : {
              type: 'CHECKBOX',
              value: true,
              id: input.id,
            };

      acc[id] = userInput;
      return acc;
    },
    {},
  );
  return { smartLinkId, actionId, inputs };
};
