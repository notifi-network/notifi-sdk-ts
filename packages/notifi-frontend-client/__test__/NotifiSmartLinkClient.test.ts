import {
  NotifiSmartLinkClient,
  newSmartLinkClient,
} from '@notifi-network/notifi-frontend-client';
import expect from 'expect';

import { authParams, getActionInput, smartLink } from './constants';

describe('Notifi SmartLink & Action Unit Tests', () => {
  it('Fetch SmartLinkConfig', async () => {
    const client: NotifiSmartLinkClient = newSmartLinkClient({});
    const smartLinkConfig = await client.fetchSmartLinkConfig(smartLink);
    expect(smartLinkConfig).toHaveProperty('smartLinkConfig');
    expect(smartLinkConfig).toHaveProperty('isActive');
  });

  // Temporarily disabling these tests until the backend issues are resolved. (500 internal server error)
  // it('Activate SmartLinkAction w/ transactions', async () => {
  //   const client = newSmartLinkClient({
  //     authParams,
  //   });
  //   const { smartLinkConfig } = await client.fetchSmartLinkConfig(smartLink);
  //   const activateSmartLinkActionInput = getActionInput(
  //     smartLink,
  //     smartLinkConfig,
  //     0, // 1st Action
  //   );
  //   const response = await client.activateSmartLinkAction(
  //     activateSmartLinkActionInput,
  //   );
  //   expect(response).toHaveProperty('successMessage');
  //   expect(response).toHaveProperty('failureMessage');
  //   expect(response).toHaveProperty('transactions');
  // });

  // it('Activate SmartLinkAction w/o transactions', async () => {
  //   const client = newSmartLinkClient({
  //     authParams,
  //   });
  //   const { smartLinkConfig } = await client.fetchSmartLinkConfig(smartLink);
  //   const activateSmartLinkActionInput = getActionInput(
  //     smartLink,
  //     smartLinkConfig,
  //     1, // 2nd Action
  //   );
  //   const response = await client.activateSmartLinkAction(
  //     activateSmartLinkActionInput,
  //   );
  //   expect(response).toHaveProperty('successMessage');
  //   expect(response).toHaveProperty('failureMessage');
  //   expect(response).not.toHaveProperty('transactions');
  // });
});
