import ensureTarget, {
  ensureEmail,
  ensureSms,
  ensureTelegram,
} from './ensureTarget';
import type {
  CreateEmailTargetService,
  CreateSmsTargetService,
  CreateTelegramTargetService,
  EmailTarget,
  SmsTarget,
  TelegramTarget,
} from '@notifi-network/notifi-core';

describe('ensureTarget', () => {
  const createSpy = jest.fn();

  type TestTarget = Readonly<{ id: string | null }>;
  const service = {};
  const ensureTestTarget = ensureTarget(createSpy, (it) => it.id);

  beforeEach(() => {
    createSpy.mockReset();
  });

  it('returns null when the value is null', async () => {
    const result = await ensureTestTarget(service, [], null);
    expect(result).toBeNull();
    expect(createSpy).not.toHaveBeenCalled();
  });

  describe('when existing array is undefined', () => {
    const existing: TestTarget[] | undefined = undefined;
    const subject = async () =>
      await ensureTestTarget(service, existing, 'some-id');

    it('returns the result from createFunc', async () => {
      const created: TestTarget = { id: 'result-id' };
      createSpy.mockResolvedValueOnce(created);

      const result = await subject();
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(created.id);
    });

    it('throws when underlying function throws', async () => {
      createSpy.mockRejectedValueOnce(new Error('Some error'));

      await expect(subject()).rejects.toThrow();
    });
  });

  describe('when existing array exists', () => {
    const existingId = 'some-existing-id';
    const existingItem: TestTarget = { id: existingId };
    let existing = [existingItem];

    beforeEach(() => {
      existing = [existingItem];
    });

    describe('when the array contains the id', () => {
      const subject = async () =>
        await ensureTestTarget(service, existing, existingId);

      beforeEach(() => {
        createSpy.mockRejectedValue(new Error('Should not be called'));
      });

      it('does not call createFunc', async () => {
        await subject();
        expect(createSpy).not.toHaveBeenCalled();
      });

      it('returns the existing item', async () => {
        const result = await subject();
        expect(result).toEqual(existingItem.id);
      });

      it('does not modify the existing array', async () => {
        await subject();
        expect(existing.length).toEqual(1);
        expect(existing).toStrictEqual([existingItem]);
      });
    });

    describe('when the array does not contain the id', () => {
      const subject = async () =>
        await ensureTestTarget(service, existing, 'some-other-id');

      describe('when the underlying createFunc succeeds', () => {
        const createdObject = { id: 'some-other-id' };
        beforeEach(() => {
          createSpy.mockResolvedValueOnce(createdObject);
        });

        it('calls the underlying createFunc', async () => {
          subject();
          expect(createSpy).toHaveBeenCalledTimes(1);
        });

        it('returns the created object id', async () => {
          const result = await subject();
          expect(result).toEqual(createdObject.id);
        });

        it('pushes the results to the existing array', async () => {
          await subject();
          expect(existing.length).toEqual(2);
          expect(existing[1]).toEqual(createdObject);
        });
      });

      it('throws when the underlying createFunc fails', async () => {
        createSpy.mockRejectedValueOnce(new Error('Some error'));
        await expect(subject()).rejects.toThrow();
        expect(createSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});

describe('ensureEmail', () => {
  const createSpy = jest.fn();
  const service: CreateEmailTargetService = {
    createEmailTarget: createSpy,
  };

  const existingItem = {
    id: 'existing',
    emailAddress: 'existing@e.mail',
  } as EmailTarget;

  const nullItem = {
    id: null,
    emailAddress: null,
  } as EmailTarget;

  let existing = [existingItem, nullItem];

  const subject = async (value: string | null) =>
    ensureEmail(service, existing, value);

  beforeEach(() => {
    createSpy.mockReset();
    existing = [existingItem, nullItem];
  });

  describe('when using an existing email with different casing', () => {
    it('does not call the createFunc', async () => {
      await subject('Existing@E.mail');
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('returns the id of the existing target', async () => {
      const result = await subject('Existing@E.mail');
      expect(result).toEqual(existingItem.id);
    });

    it('does not modify the existing array', async () => {
      await subject('Existing@E.mail');
      expect(existing).toStrictEqual([existingItem, nullItem]);
    });
  });

  describe('when using an existing email', () => {
    it('does not call the createFunc', async () => {
      await subject(existingItem.emailAddress);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('returns the id of the existing target', async () => {
      const result = await subject(existingItem.emailAddress);
      expect(result).toEqual(existingItem.id);
    });

    it('does not modify the existing array', async () => {
      await subject(existingItem.emailAddress);
      expect(existing).toStrictEqual([existingItem, nullItem]);
    });
  });

  describe('when using a new email', () => {
    const emailAddress = 'new@e.mail';
    describe('when the underlying request succeeds', () => {
      const createdItem = { id: 'created', emailAddress };
      beforeEach(() => {
        createSpy.mockResolvedValueOnce(createdItem);
      });

      it('calls the createFunc', async () => {
        await subject(emailAddress);
        expect(createSpy).toHaveBeenCalledTimes(1);
      });

      it('returns the id of the created item', async () => {
        const result = await subject(emailAddress);
        expect(result).toEqual(createdItem.id);
      });

      it('pushes the created item into existing array', async () => {
        await subject(emailAddress);
        expect(existing).toStrictEqual([existingItem, nullItem, createdItem]);
      });
    });

    it('throws when the underlying createFunc fails', async () => {
      createSpy.mockRejectedValueOnce(new Error('Some underlying error'));
      await expect(subject(emailAddress)).rejects.toThrow();
    });
  });
});

describe('ensureSms', () => {
  const createSpy = jest.fn();
  const service: CreateSmsTargetService = {
    createSmsTarget: createSpy,
  };

  const existingItem = {
    id: 'existing',
    phoneNumber: '+18005550001',
  } as SmsTarget;
  let existing = [existingItem];

  const subject = async (value: string | null) =>
    ensureSms(service, existing, value);

  beforeEach(() => {
    createSpy.mockReset();
    existing = [existingItem];
  });

  describe('when using an existing phone number', () => {
    it('does not call the createFunc', async () => {
      await subject(existingItem.phoneNumber);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('returns the id of the existing target', async () => {
      const result = await subject(existingItem.phoneNumber);
      expect(result).toEqual(existingItem.id);
    });

    it('does not modify the existing array', async () => {
      await subject(existingItem.phoneNumber);
      expect(existing).toStrictEqual([existingItem]);
    });
  });

  describe('when using a new number', () => {
    const phoneNumber = '+18005551337';
    describe('when the underlying request succeeds', () => {
      const createdItem = { id: 'created', phoneNumber };
      beforeEach(() => {
        createSpy.mockResolvedValueOnce(createdItem);
      });

      it('calls the createFunc', async () => {
        await subject(phoneNumber);
        expect(createSpy).toHaveBeenCalledTimes(1);
      });

      it('returns the id of the created item', async () => {
        const result = await subject(phoneNumber);
        expect(result).toEqual(createdItem.id);
      });

      it('pushes the created item into existing array', async () => {
        await subject(phoneNumber);
        expect(existing).toStrictEqual([existingItem, createdItem]);
      });
    });

    it('throws when the underlying createFunc fails', async () => {
      createSpy.mockRejectedValueOnce(new Error('Some underlying error'));
      await expect(subject(phoneNumber)).rejects.toThrow();
    });
  });
});

describe('ensureTelegram', () => {
  const createSpy = jest.fn();
  const service: CreateTelegramTargetService = {
    createTelegramTarget: createSpy,
  };

  const existingItem = {
    id: 'existing',
    telegramId: 'some-telegram-id',
  } as TelegramTarget;
  let existing = [existingItem];

  const subject = async (value: string | null) =>
    ensureTelegram(service, existing, value);

  beforeEach(() => {
    createSpy.mockReset();
    existing = [existingItem];
  });

  describe('when using an existing telegramId', () => {
    it('does not call the createFunc', async () => {
      await subject(existingItem.telegramId);
      expect(createSpy).not.toHaveBeenCalled();
    });

    it('returns the id of the existing target', async () => {
      const result = await subject(existingItem.telegramId);
      expect(result).toEqual(existingItem.id);
    });

    it('does not modify the existing array', async () => {
      await subject(existingItem.telegramId);
      expect(existing).toStrictEqual([existingItem]);
    });
  });

  describe('when using a new telegramId', () => {
    const telegramId = 'different-telegram-id';
    describe('when the underlying request succeeds', () => {
      const createdItem = { id: 'created', telegramId };
      beforeEach(() => {
        createSpy.mockResolvedValueOnce(createdItem);
      });

      it('calls the createFunc', async () => {
        await subject(telegramId);
        expect(createSpy).toHaveBeenCalledTimes(1);
      });

      it('returns the id of the created item', async () => {
        const result = await subject(telegramId);
        expect(result).toEqual(createdItem.id);
      });

      it('pushes the created item into existing array', async () => {
        await subject(telegramId);
        expect(existing).toStrictEqual([existingItem, createdItem]);
      });
    });

    it('throws when the underlying createFunc fails', async () => {
      createSpy.mockRejectedValueOnce(new Error('Some underlying error'));
      await expect(subject(telegramId)).rejects.toThrow();
    });
  });
});
