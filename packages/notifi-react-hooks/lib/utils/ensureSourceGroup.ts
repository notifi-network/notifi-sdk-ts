import {
  CreateSourceGroupInput,
  CreateSourceGroupService,
  SourceGroup,
  UpdateSourceGroupService,
} from '@notifi-network/notifi-core';

const updateSourceGroup = async (
  service: UpdateSourceGroupService,
  existing: SourceGroup,
  input: CreateSourceGroupInput,
): Promise<SourceGroup> => {
  const sourceGroupId = existing.id;
  if (sourceGroupId === null) {
    throw new Error('Invalid source group');
  }

  return await service.updateSourceGroup({
    id: sourceGroupId,
    ...input,
  });
};

const ensureSourceGroup = async (
  service: CreateSourceGroupService & UpdateSourceGroupService,
  existing: SourceGroup[],
  input: CreateSourceGroupInput,
) => {
  const existingIndex = existing.findIndex((it) => it.name === input.name);
  if (existingIndex >= 0) {
    const result = await updateSourceGroup(
      service,
      existing[existingIndex],
      input,
    );
    existing[existingIndex] = result;
    return result;
  } else {
    const result = await service.createSourceGroup(input);
    existing.push(result);
    return result;
  }
};

export default ensureSourceGroup;
