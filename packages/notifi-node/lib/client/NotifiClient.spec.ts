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

  describe('sendSimpleHealthThreshold', () => {
    const params: Parameters<NotifiClient['sendSimpleHealthThreshold']>[1] = {
      key: 'some-message-key',
      walletPublicKey: 'base58string',
      walletBlockchain: 'SOLANA',
      value: 0.5,
    };

    it('calls post with the right parameters', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            sendMessage: true,
          },
        },
      });

      await subject.sendSimpleHealthThreshold('some-jwt', params);

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringMatching('/'),
        {
          query: expect.stringContaining('sendMessage'),
          variables: {
            input: {
              message: JSON.stringify({ value: 0.5 }),
              messageKey: 'some-message-key',
              messageType: 'SIMPLE_HEALTH_THRESHOLD',
              walletBlockchain: 'SOLANA',
              walletPublicKey: 'base58string',
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

    it('throws when underlying request throws', async () => {
      postSpy.mockRejectedValueOnce(new Error('Some network error'));
      await expect(
        subject.sendSimpleHealthThreshold('some-jwt', params),
      ).rejects.toThrow();
    });

    it('throws when query succeeds with errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(
        subject.sendSimpleHealthThreshold('some-jwt', params),
      ).rejects.toThrow();
    });

    it('throws when query succeeds with no data', async () => {
      postSpy.mockResolvedValueOnce({
        data: {},
      });
      await expect(
        subject.sendSimpleHealthThreshold('some-jwt', params),
      ).rejects.toThrow();
    });

    it('does not throw when query has both data and errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            sendMessage: true,
          },
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(
        subject.sendSimpleHealthThreshold('some-jwt', params),
      ).resolves.not.toThrow();
    });
  });

  describe('deleteUserAlert', () => {
    it('calls post with the right parameters', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            deleteUserAlert: {
              id: 'some-id',
            },
          },
        },
      });

      await subject.deleteUserAlert('some-jwt', {
        alertId: 'some-id',
      });

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith(
        expect.stringMatching('/'),
        {
          query: expect.stringContaining('deleteUserAlert'),
          variables: {
            alertId: 'some-id',
          },
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
      await expect(
        subject.deleteUserAlert('some-jwt', {
          alertId: 'some-id',
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
        subject.deleteUserAlert('some-jwt', {
          alertId: 'some-id',
        }),
      ).rejects.toThrow();
    });

    it('throws when query succeeds with no data', async () => {
      postSpy.mockResolvedValueOnce({
        data: {},
      });
      await expect(
        subject.deleteUserAlert('some-jwt', {
          alertId: 'some-id',
        }),
      ).rejects.toThrow();
    });

    it('does not throw when query has both data and errors', async () => {
      postSpy.mockResolvedValueOnce({
        data: {
          data: {
            deleteUserAlert: {
              id: 'some-id',
            },
          },
          errors: [{ message: 'Some graphQL error' }],
        },
      });
      await expect(
        subject.deleteUserAlert('some-jwt', {
          alertId: 'some-id',
        }),
      ).resolves.not.toThrow();
    });
  });
});
