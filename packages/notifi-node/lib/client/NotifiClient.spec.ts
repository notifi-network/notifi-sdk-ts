import NotifiClient from './NotifiClient';

describe('NotifiClient', () => {
  const postSpy = jest.fn();
  const axiosPost = {
    post: postSpy,
  };
  const subject = new NotifiClient(axiosPost);

  beforeEach(() => {
    postSpy.mockClear();
  });

  describe('logIn', () => {
    it('calls post with the right parameters', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            logInFromService: {
              token: 'some-token',
              expiry: '2022-12-12',
            },
          },
        },
      });

      await subject.logIn({
        sid: 'some-sid',
        secret: 'some-secret',
      });

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringMatching('/'),
        {
          query: expect.stringContaining('logInFromService'),
          variables: {
            input: {
              sid: 'some-sid',
              secret: 'some-secret',
            },
          },
        },
        undefined,
      );
    });

    it('returns the token and expiry from the response', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            logInFromService: {
              token: 'some-token',
              expiry: '2022-12-12',
            },
          },
        },
      });

      const result = await subject.logIn({
        sid: 'some-sid',
        secret: 'some-secret',
      });

      expect(result).toStrictEqual({
        token: 'some-token',
        expiry: '2022-12-12',
      });
    });

    it('throws when underlying request throws', async () => {
      postSpy.mockRejectedValueOnce(new Error('Some network error'));
      await expect(
        subject.logIn({
          sid: 'some-sid',
          secret: 'some-secret',
        }),
      ).rejects.toThrow();
    });

    it('throws when query succeeds with errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(
        subject.logIn({
          sid: 'some-sid',
          secret: 'some-secret',
        }),
      ).rejects.toThrow();
    });

    it('throws when query succeeds with no data', async () => {
      postSpy.mockResolvedValueOnce({
        data: {},
      });
      await expect(
        subject.logIn({
          sid: 'some-sid',
          secret: 'some-secret',
        }),
      ).rejects.toThrow();
    });

    it('does not throw when query has both data and errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            logInFromService: {
              token: 'some-token',
              expiry: '2022-12-12',
            },
          },
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(
        subject.logIn({
          sid: 'some-sid',
          secret: 'some-secret',
        }),
      ).resolves.not.toThrow();
    });
  });

  const commonAssertions = (
    call: () => Promise<unknown>,
    queryName: string,
    expectedVariables: unknown,
    successData: unknown,
  ) => {
    it('calls post with the right parameters', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: successData,
        },
      });

      await call();

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringMatching('/'),
        {
          query: expect.stringContaining(queryName),
          variables: expectedVariables,
        },
        {
          headers: {
            Authorization: `Bearer some-jwt`,
          },
        },
      );
    });

    it('throws when underlying request throws', async () => {
      postSpy.mockRejectedValueOnce(new Error('Some network error'));
      await expect(call()).rejects.toThrow();
    });

    it('throws when query succeeds with errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(call()).rejects.toThrow();
    });

    it('throws when query succeeds with no data', async () => {
      postSpy.mockResolvedValueOnce({
        data: {},
      });
      await expect(call()).rejects.toThrow();
    });

    it('does not throw when query has both data and errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: successData,
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(call()).resolves.not.toThrow();
    });
  };

  describe('sendSimpleHealthThreshold', () => {
    const params: Parameters<NotifiClient['sendSimpleHealthThreshold']>[1] = {
      key: 'some-message-key',
      walletPublicKey: 'base58string',
      walletBlockchain: 'SOLANA',
      healthValue: 0.5,
    };

    commonAssertions(
      async () => await subject.sendSimpleHealthThreshold('some-jwt', params),
      'sendMessage',
      {
        input: {
          message: JSON.stringify({ healthValue: 0.5 }),
          messageKey: 'some-message-key',
          messageType: 'SIMPLE_HEALTH_THRESHOLD',
          walletBlockchain: 'SOLANA',
          walletPublicKey: 'base58string',
        },
      },
      {
        sendMessage: true,
      },
    );

    it('throws when data is false', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            sendMessage: false,
          },
        },
      });

      await expect(
        subject.sendSimpleHealthThreshold('some-jwt', params),
      ).rejects.toThrow();
    });
  });

  describe('sendDirectPush', () => {
    const params: Parameters<NotifiClient['sendDirectPush']>[1] = {
      key: 'some-message-key',
      walletPublicKey: 'base58string',
      walletBlockchain: 'NEAR',
      message: 'this is a direct push message',
    };

    commonAssertions(
      async () => await subject.sendDirectPush('some-jwt', params),
      'sendMessage',
      {
        input: {
          message: JSON.stringify({ message: 'this is a direct push message' }),
          messageKey: 'some-message-key',
          messageType: 'DIRECT_TENANT_MESSAGE',
          walletBlockchain: 'NEAR',
          walletPublicKey: 'base58string',
        },
      },
      {
        sendMessage: true,
      },
    );

    it('throws when data is false', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            sendMessage: false,
          },
        },
      });

      await expect(
        subject.sendDirectPush('some-jwt', params),
      ).rejects.toThrow();
    });
  });

  describe('deleteUserAlert', () => {
    const params: Parameters<NotifiClient['deleteUserAlert']>[1] = {
      alertId: 'some-id',
    };

    commonAssertions(
      async () => await subject.deleteUserAlert('some-jwt', params),
      'deleteUserAlert',
      { alertId: 'some-id' },
      {
        deleteUserAlert: {
          id: 'some-id',
        },
      },
    );

    it('returns the parameter id', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            deleteUserAlert: {
              id: 'some-other-id',
            },
          },
        },
      });
      const result = await subject.deleteUserAlert('some-jwt', params);
      expect(result).toEqual('some-id');
    });
  });

  describe('createTenantUser', () => {
    const params: Parameters<NotifiClient['createTenantUser']>[1] = {
      walletPublicKey: 'base58string',
      walletBlockchain: 'NEAR',
    };

    commonAssertions(
      async () => await subject.createTenantUser('some-jwt', params),
      'createTenantUser',
      {
        input: {
          walletPublicKey: 'base58string',
          walletBlockchain: 'NEAR',
        },
      },
      {
        createTenantUser: {
          id: 'some-user-id',
        },
      },
    );

    it('returns the id from the response', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            createTenantUser: {
              id: 'some-user-id',
            },
          },
        },
      });

      const result = await subject.createTenantUser('some-jwt', params);

      expect(result).toStrictEqual('some-user-id');
    });
  });

  describe('createDirectPushAlert', () => {
    const params: Parameters<NotifiClient['createDirectPushAlert']>[1] = {
      userId: 'some-user-id',
      emailAddresses: ['some@e.mail'],
      phoneNumbers: ['+18005551337'],
    };

    commonAssertions(
      async () => await subject.createDirectPushAlert('some-jwt', params),
      'createDirectPushAlert',
      {
        input: {
          userId: 'some-user-id',
          emailAddresses: ['some@e.mail'],
          phoneNumbers: ['+18005551337'],
        },
      },
      {
        createDirectPushAlert: {
          id: 'some-alert-id',
        },
      },
    );

    it('returns the alert from the response', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            createDirectPushAlert: {
              id: 'some-alert-id',
            },
          },
        },
      });

      const result = await subject.createDirectPushAlert('some-jwt', params);

      expect(result).toStrictEqual({ id: 'some-alert-id' });
    });

    it('uses empty arrays if a param is missing', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            createDirectPushAlert: {
              id: 'some-alert-id',
            },
          },
        },
      });

      await subject.createDirectPushAlert('some-jwt', {
        userId: 'some-user-id',
      });

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringMatching('/'),
        {
          query: expect.stringContaining('createDirectPushAlert'),
          variables: {
            input: {
              userId: 'some-user-id',
              emailAddresses: [],
              phoneNumbers: [],
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer some-jwt`,
          },
        },
      );
    });
  });

  describe('deleteDirectPushAlert', () => {
    const params: Parameters<NotifiClient['deleteDirectPushAlert']>[1] = {
      alertId: 'some-alert-id',
    };

    commonAssertions(
      async () => await subject.deleteDirectPushAlert('some-jwt', params),
      'deleteDirectPushAlert',
      {
        input: {
          alertId: 'some-alert-id',
        },
      },
      {
        deleteDirectPushAlert: {
          id: 'some-alert-id',
        },
      },
    );

    it('returns the alert from the response', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            deleteDirectPushAlert: {
              id: 'some-alert-id',
            },
          },
        },
      });

      const result = await subject.deleteDirectPushAlert('some-jwt', params);

      expect(result).toStrictEqual({ id: 'some-alert-id' });
    });
  });
});
