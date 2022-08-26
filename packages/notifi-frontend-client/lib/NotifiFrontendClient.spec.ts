import { NotifiService } from '@notifi-network/notifi-graphql';
import { GraphQLClient } from 'graphql-request';

import { NotifiFrontendClient } from './NotifiFrontendClient';
import type { NotifiFrontendConfiguration } from './configuration/NotifiFrontendConfiguration';

describe('NotifiFrontendClient', () => {
  const mockFn = jest.fn();

  jest.mock('@notifi-network/notifi-graphql');
  jest.mock('./storage/NotifiFrontendStorage');

  const MockNotifi = jest.mock(NotifiService);
  const NotifiServiceMock = new NotifiService(new GraphQLClient(''));
  // const NotifiFrontendStorageMock = NotifiFrontendStorage;

  const storageMock = {
    getAuthorization: jest.fn(),
    setAuthorization: jest.fn(),
    hasAuthorization: jest.fn(),
    getRoles: jest.fn(),
    setRoles: jest.fn(),
    hasRoles: jest.fn(),
  };

  const NotifiFrontendConfigurationMock: NotifiFrontendConfiguration = {
    dappAddress: 'some-address',
    env: 'Development',
  };

  const subject = new NotifiFrontendClient(
    NotifiFrontendConfigurationMock,
    NotifiService,
    storageMock,
  );

  beforeEach(() => {
    mockFn.mockClear();
  });

  describe('logIn', () => {
    it('calls calling log in invokes _signMessage, service.logInFromDapp, and _handleLogInResult with the right parameters', async () => {
      const signFn = jest.fn();

      const loginFn = await subject.logIn({
        walletAddress: 'some-wallet-address',
        signMessage: signFn(),
      });

      expect(loginFn).toHaveBeenCalledTimes(1);
      expect(loginFn).toHaveBeenCalledWith(
        expect.stringMatching('/'),
        {
          query: expect.stringContaining('_signMessage'),
          variables: {
            input: {
              walletAddress: 'some-wallet-address',
              signMessage: signFn(),
              timestamp: 123456789,
            },
          },
        },
        'some-signature',
      );

      const loginFromDappResult = {
        email: 'some-email',
        emailConfirmed: true,
        roles: 'some-role',
        authorization: {
          token: 'some-token',
          expiry: 'some-expiry',
        },
      };

      expect(loginFn).toHaveBeenCalledWith(expect.stringMatching('/'), {
        query: expect.stringContaining('logInFromDapp'),
        variables: {
          input: {
            walletPublicKey: 'some-wallet-address',
            dappAddress: NotifiFrontendConfigurationMock.dappAddress,
            timestamp: 123456789,
            signature: 'some-signature',
          },
        },
        loginFromDappResult,
      });

      expect(loginFn).toHaveBeenCalledWith(expect.stringMatching('/'), {
        query: expect.stringContaining('_handleLoginResult'),
        variables: {
          input: loginFromDappResult,
        },
      });

      expect(loginFn).toHaveReturnedWith(loginFromDappResult);
    });
  });
});
