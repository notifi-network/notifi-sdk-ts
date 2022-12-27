import {
  CreateSourceGroupInput,
  CreateSourceGroupService,
  Source,
  SourceGroup,
  UpdateSourceGroupInput,
  UpdateSourceGroupService,
} from '@notifi-network/notifi-core';

import ensureSourceGroup from './ensureSourceGroup';

const createSource = (id: string): Source => {
  return {
    id,
    name: id,
    blockchainAddress: 'BBqe9bApNYvr27fKXZxA8QuYdihYDBNX4E2EZJz8zNRY',
    type: 'SOLANA_WALLET',
    applicableFilters: [],
  };
};

const testUpdateSourceGroup = async (
  input: UpdateSourceGroupInput,
): Promise<SourceGroup> => {
  return {
    id: input.id,
    name: input.name,
    sources: input.sourceIds.map(createSource),
  };
};

const testCreateSourceGroup = async (
  input: CreateSourceGroupInput,
): Promise<SourceGroup> => {
  return {
    id: 'a-new-target-group-id',
    name: input.name,
    sources: input.sourceIds.map(createSource),
  };
};
describe('ensureSourceGroup', () => {
  const createSpy = jest.fn();
  const updateSpy = jest.fn();
  const testService: CreateSourceGroupService & UpdateSourceGroupService = {
    createSourceGroup: createSpy,
    updateSourceGroup: updateSpy,
  };

  beforeEach(() => {
    createSpy.mockReset();
    updateSpy.mockReset();
  });

  describe('when an alert with the name exists', () => {
    const existingSourceGroup = {
      id: 'some-source-group-id',
      name: 'An existing source group',
      sources: [],
    };

    const desiredSourceGroup = {
      name: existingSourceGroup.name,
      sourceIds: ['some-source-id'],
    };

    let existing: SourceGroup[] = [existingSourceGroup];

    beforeEach(() => {
      existing = [existingSourceGroup];
    });

    const subject = async () =>
      await ensureSourceGroup(testService, existing, desiredSourceGroup);

    describe('when the call to update succeeds', () => {
      beforeEach(() => {
        updateSpy.mockImplementationOnce(testUpdateSourceGroup);
      });

      it('does not call the create service', async () => {
        await subject();
        expect(createSpy).not.toHaveBeenCalled();
      });

      it('calls update with the right id', async () => {
        await subject();
        expect(updateSpy).toHaveBeenCalledWith({
          id: existingSourceGroup.id,
          ...desiredSourceGroup,
        });
      });

      it('returns the updated sourceGroup', async () => {
        const expected = await testUpdateSourceGroup({
          id: existingSourceGroup.id,
          ...desiredSourceGroup,
        });
        const result = await subject();
        expect(result).toStrictEqual(expected);
      });
    });

    it('throws when update throws', async () => {
      updateSpy.mockRejectedValueOnce(new Error('Some error'));
      await expect(subject()).rejects.toThrow();
    });

    it('throws when the existing target has null id', async () => {
      existing = [
        {
          id: null,
          name: existingSourceGroup.name,
          sources: existingSourceGroup.sources,
        },
      ];

      await expect(subject()).rejects.toThrow();
    });
  });

  describe('when an alert with the name does not exist', () => {
    const existingSourceGroup = {
      id: 'some-source-group-id',
      name: 'An existing source group',
      sources: [],
    };

    const desiredSourceGroup = {
      name: 'A newly created Source Group',
      sourceIds: ['some-source-id'],
    };

    let existing: SourceGroup[] = [existingSourceGroup];

    beforeEach(() => {
      existing = [existingSourceGroup];
    });

    const subject = async () =>
      await ensureSourceGroup(testService, existing, desiredSourceGroup);

    describe('when the call to create succeeds', () => {
      beforeEach(() => {
        createSpy.mockImplementationOnce(testCreateSourceGroup);
      });

      it('does not call the udpate service', async () => {
        await subject();
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('does not modify the existing sourceGroup', async () => {
        await subject();
        expect(existing[0]).toStrictEqual(existingSourceGroup);
      });

      it('calls create with the desired params', async () => {
        await subject();
        expect(createSpy).toHaveBeenCalledWith(desiredSourceGroup);
      });

      it('returns the created sourceGroup', async () => {
        const expected = await testCreateSourceGroup(desiredSourceGroup);
        const result = await subject();
        expect(result).toStrictEqual(expected);
      });

      it('appends to the existing array', async () => {
        const expected = await testCreateSourceGroup(desiredSourceGroup);
        await subject();
        expect(existing).toStrictEqual([existingSourceGroup, expected]);
      });
    });

    it('throws when create fails', async () => {
      createSpy.mockRejectedValueOnce(new Error('Some error'));
      await expect(subject()).rejects.toThrow();
    });
  });
});
