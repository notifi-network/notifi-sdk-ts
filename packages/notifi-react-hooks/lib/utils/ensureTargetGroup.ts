import {
  CreateTargetGroupInput,
  CreateTargetGroupService,
  TargetGroup,
  UpdateTargetGroupService,
} from '@notifi-network/notifi-core';

const updateTargetGroup = async (
  service: UpdateTargetGroupService,
  existing: TargetGroup,
  input: CreateTargetGroupInput,
): Promise<TargetGroup> => {
  const targetGroupId = existing.id;
  if (targetGroupId === null) {
    throw new Error('Invalid target group');
  }

  return await service.updateTargetGroup({
    id: targetGroupId,
    ...input,
  });
};

const ensureTargetGroup = async (
  service: CreateTargetGroupService & UpdateTargetGroupService,
  existing: Array<TargetGroup>,
  input: CreateTargetGroupInput,
): Promise<TargetGroup> => {
  const existingIndex = existing.findIndex((it) => it.name === input.name);
  if (existingIndex >= 0) {
    const result = await updateTargetGroup(
      service,
      existing[existingIndex],
      input,
    );
    existing[existingIndex] = result;
    return result;
  } else {
    const result = await service.createTargetGroup(input);
    existing.push(result);
    return result;
  }
};

export default ensureTargetGroup;
