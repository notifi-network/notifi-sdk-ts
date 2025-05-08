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

  it('Activate SmartLinkAction w/ transactions', async () => {
    const client = newSmartLinkClient({
      env,
      authParams,
    });
    const { smartLinkConfig } = await client.fetchSmartLinkConfig(smartLink);
    const activateSmartLinkActionInput = getActionInput(
      smartLink,
      smartLinkConfig,
      0, // 1st Action
    );
    const response = await client.activateSmartLinkAction(
      activateSmartLinkActionInput,
    );
    expect(response).toHaveProperty('successMessage');
    expect(response).toHaveProperty('failureMessage');
    expect(response).toHaveProperty('transactions');
  });
  it('Activate SmartLinkAction w/o transactions', async () => {
    const client = newSmartLinkClient({
      env,
      authParams,
    });
    const { smartLinkConfig } = await client.fetchSmartLinkConfig(smartLink);
    const activateSmartLinkActionInput = getActionInput(
      smartLink,
      smartLinkConfig,
      1, // 2nd Action
    );
    const response = await client.activateSmartLinkAction(
      activateSmartLinkActionInput,
    );
    expect(response).toHaveProperty('successMessage');
    expect(response).toHaveProperty('failureMessage');
    expect(response).not.toHaveProperty('transactions');
  });
});

// Utils & Constants (TODO: Move to a separate module when growing)
/* Test SmartLink ID under Tenant `notifi.network.unitest` */
const smartLink = '1e74002c84f3445480c54424a145a62a';
const env: NotifiEnvironment = 'Production';
const authParams: AuthParams = {
  walletBlockchain: 'ARBITRUM',
  walletPublicKey: '0x0',
};

/* Grab nth Action and generate a valid user inputs */
const getActionInput = (
  smartLinkId: string,
  smartLinkConfig: SmartLinkConfig,
  itemNumber: number,
): Omit<ActivateSmartLinkActionInput, 'authParams'> => {
  const smartLinkActions = smartLinkConfig.components.filter(
    (component) => component.type === 'ACTION',
  );
  const actionId = smartLinkActions[itemNumber].id;
  const inputs = smartLinkActions[itemNumber].inputs.reduce(
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
