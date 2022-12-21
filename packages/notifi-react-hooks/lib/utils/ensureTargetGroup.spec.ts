import {
  CreateTargetGroupInput,
  CreateTargetGroupService,
  EmailTarget,
  SmsTarget,
  TargetGroup,
  TelegramTarget,
  UpdateTargetGroupInput,
  UpdateTargetGroupService,
} from '@notifi-network/notifi-core';

import ensureTargetGroup from './ensureTargetGroup';

const createEmailTarget = (id: string): EmailTarget => {
  return {
    id,
    name: 'some@e.mail',
    emailAddress: 'some@e.mail',
    isConfirmed: true,
  };
};

const createSmsTarget = (id: string): SmsTarget => {
  return {
    id,
    name: '+18005551337',
    phoneNumber: '+18005551337',
    isConfirmed: true,
  };
};

const createTelegramTarget = (id: string): TelegramTarget => {
  return {
    id,
    name: 'some-telegram-id',
    telegramId: 'some-telegram-id',
    confirmationUrl: null,
    isConfirmed: true,
  };
};

const testUpdateTargetGroup = async (
  input: UpdateTargetGroupInput,
): Promise<TargetGroup> => {
  return {
    id: input.id,
    name: input.name,
    emailTargets: input.emailTargetIds.map(createEmailTarget),
    smsTargets: input.smsTargetIds.map(createSmsTarget),
    telegramTargets: input.telegramTargetIds.map(createTelegramTarget),
  };
};

const testCreateTargetGroup = async (
  input: CreateTargetGroupInput,
): Promise<TargetGroup> => {
  return {
    id: 'a-new-target-group-id',
    name: input.name,
    emailTargets: input.emailTargetIds.map(createEmailTarget),
    smsTargets: input.smsTargetIds.map(createSmsTarget),
    telegramTargets: input.telegramTargetIds.map(createTelegramTarget),
  };
};

describe('ensureTargetGroup', () => {
  const createSpy = jest.fn();
  const updateSpy = jest.fn();
  const testService: CreateTargetGroupService & UpdateTargetGroupService = {
    createTargetGroup: createSpy,
    updateTargetGroup: updateSpy,
  };

  beforeEach(() => {
    createSpy.mockReset();
    updateSpy.mockReset();
  });

  describe('when an alert with the name exists', () => {
    const existingTargetGroup = {
      id: 'some-target-group-id',
      name: 'An existing target group',
      emailTargets: [],
      smsTargets: [],
      telegramTargets: [],
    };

    const desiredTargetGroup = {
      name: existingTargetGroup.name,
      emailTargetIds: ['email-target-id'],
      smsTargetIds: ['sms-target-id'],
      telegramTargetIds: ['telegram-target-id'],
    };

    let existing: TargetGroup[] = [existingTargetGroup];

    beforeEach(() => {
      existing = [existingTargetGroup];
    });

    const subject = async () =>
      await ensureTargetGroup(testService, existing, desiredTargetGroup);

    describe('when the call to update succeeds', () => {
      beforeEach(() => {
        updateSpy.mockImplementationOnce(testUpdateTargetGroup);
      });

      it('does not call the create service', async () => {
        await subject();
        expect(createSpy).not.toHaveBeenCalled();
      });

      it('calls update with the right id', async () => {
        await subject();
        expect(updateSpy).toHaveBeenCalledWith({
          id: existingTargetGroup.id,
          ...desiredTargetGroup,
        });
      });

      it('updates the existing array', async () => {
        const expected = await testUpdateTargetGroup({
          id: existingTargetGroup.id,
          ...desiredTargetGroup,
        });
        await subject();
        expect(existing).toStrictEqual([expected]);
      });

      it('returns the updated target group', async () => {
        const expected = await testUpdateTargetGroup({
          id: existingTargetGroup.id,
          ...desiredTargetGroup,
        });
        const result = await subject();
        expect(result).toStrictEqual(expected);
      });
    });

    it('throws when udpate throws', async () => {
      updateSpy.mockRejectedValueOnce(new Error('Some error'));
      await expect(subject()).rejects.toThrow();
    });

    it('throws when the existing target has null id', async () => {
      existing = [
        {
          id: null,
          name: 'An existing target group',
          emailTargets: [],
          smsTargets: [],
          telegramTargets: [],
        },
      ];

      await expect(subject()).rejects.toThrow();
    });
  });

  describe('when an alert with the name does not exist', () => {
    const existingTargetGroup: TargetGroup = {
      id: 'a-target-group-id',
      name: 'A different target group',
      emailTargets: [],
      smsTargets: [],
      telegramTargets: [],
    };

    const desiredTargetGroup = {
      name: 'a-new-target-group',
      emailTargetIds: ['email-target-id'],
      smsTargetIds: ['sms-target-id'],
      telegramTargetIds: ['telegram-target-id'],
    };

    let existing = [existingTargetGroup];

    beforeEach(() => {
      existing = [existingTargetGroup];
    });

    const subject = async () =>
      await ensureTargetGroup(testService, existing, desiredTargetGroup);

    describe('when the call to create succeeds', () => {
      beforeEach(() => {
        createSpy.mockImplementationOnce(testCreateTargetGroup);
      });

      it('does not call the update service', async () => {
        await subject();
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('does not modify the existing target group', async () => {
        await subject();
        expect(existing[0]).toStrictEqual(existingTargetGroup);
      });

      it('calls create with the desired params', async () => {
        await subject();
        expect(createSpy).toHaveBeenCalledWith(desiredTargetGroup);
      });

      it('returns the created target group', async () => {
        const expected = await testCreateTargetGroup(desiredTargetGroup);
        const result = await subject();
        expect(result).toStrictEqual(expected);
      });

      it('appends to the existing array', async () => {
        const expected = await testCreateTargetGroup(desiredTargetGroup);
        await subject();
        expect(existing).toStrictEqual([existingTargetGroup, expected]);
      });
    });
  });
});
