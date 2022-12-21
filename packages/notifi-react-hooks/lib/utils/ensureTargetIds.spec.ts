import {
  CreateEmailTargetService,
  CreateSmsTargetService,
  CreateTelegramTargetService,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
} from '@notifi-network/notifi-core';

import ensureTargetIds from './ensureTargetIds';

describe('ensureTargetIds', () => {
  const testService: CreateEmailTargetService &
    CreateSmsTargetService &
    CreateTelegramTargetService = {
    createEmailTarget: async (input) => {
      return {
        id: 'created-email-target',
        name: input.name,
        emailAddress: input.value,
        isConfirmed: true,
      };
    },

    createSmsTarget: async (input) => {
      return {
        id: 'created-sms-target',
        name: input.name,
        phoneNumber: input.value,
        isConfirmed: true,
      };
    },

    createTelegramTarget: async (input) => {
      return {
        id: 'created-telegram-target',
        name: input.name,
        confirmationUrl: null,
        telegramId: input.value,
        isConfirmed: true,
      };
    },
  };

  describe('when the existing data has the values', () => {
    const emailTarget: EmailTarget = {
      id: 'some-email-target-id',
      name: 'some@e.mail',
      emailAddress: 'some@e.mail',
      isConfirmed: true,
    };

    const smsTarget: SmsTarget = {
      id: 'some-sms-target-id',
      name: '+18005551337',
      phoneNumber: '+18005551337',
      isConfirmed: true,
    };

    const telegramTarget: TelegramTarget = {
      id: 'some-telegram-target-id',
      name: 'some-telegram-id',
      telegramId: 'some-telegram-id',
      isConfirmed: true,
    };

    const existing = {
      emailTargets: [emailTarget],
      smsTargets: [smsTarget],
      telegramTargets: [telegramTarget],
    };

    it('returns the ids of those items', async () => {
      const results = await ensureTargetIds(testService, existing, {
        emailAddress: 'some@e.mail',
        phoneNumber: '+18005551337',
        telegramId: 'some-telegram-id',
      });

      expect(results).toStrictEqual({
        emailTargetIds: [emailTarget.id],
        smsTargetIds: [smsTarget.id],
        telegramTargetIds: [telegramTarget.id],
      });
    });
  });

  describe('when the existing data does not have the values', () => {
    it('returns the ids of created items', async () => {
      const results = await ensureTargetIds(
        testService,
        {},
        {
          emailAddress: 'new-email-address',
          phoneNumber: 'new-phone-number',
          telegramId: 'new-telegram-id',
        },
      );

      expect(results).toStrictEqual({
        emailTargetIds: ['created-email-target'],
        smsTargetIds: ['created-sms-target'],
        telegramTargetIds: ['created-telegram-target'],
      });
    });
  });

  describe('when a service call fails', () => {
    it('it throws when email fails', async () => {
      const errorService = {
        ...testService,
        createEmailTarget: jest
          .fn()
          .mockRejectedValueOnce(new Error('Some error')),
      };

      await expect(
        ensureTargetIds(
          errorService,
          {},
          {
            emailAddress: 'new-email-address',
            phoneNumber: 'new-phone-number',
            telegramId: 'new-telegram-id',
          },
        ),
      ).rejects.toThrow();
    });

    it('it throws when sms fails', async () => {
      const errorService = {
        ...testService,
        createSmsTarget: jest
          .fn()
          .mockRejectedValueOnce(new Error('Some error')),
      };

      await expect(
        ensureTargetIds(
          errorService,
          {},
          {
            emailAddress: 'new-email-address',
            phoneNumber: 'new-phone-number',
            telegramId: 'new-telegram-id',
          },
        ),
      ).rejects.toThrow();
    });

    it('it throws when telegram fails', async () => {
      const errorService = {
        ...testService,
        createTelegramTarget: jest
          .fn()
          .mockRejectedValueOnce(new Error('Some error')),
      };

      await expect(
        ensureTargetIds(
          errorService,
          {},
          {
            emailAddress: 'new-email-address',
            phoneNumber: 'new-phone-number',
            telegramId: 'new-telegram-id',
          },
        ),
      ).rejects.toThrow();
    });
  });
});
