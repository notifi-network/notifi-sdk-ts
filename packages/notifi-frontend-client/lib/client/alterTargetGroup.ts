import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import { areIdsEqual } from '../utils/areIdsEqual';
import { NotifiTarget, alterTarget } from './alterTarget';

export type AlterTargetGroupParams = Readonly<
  {
    name: string;
  } & Partial<Record<NotifiTarget, UpdateTargetsParam>>
>;
export type UpdateTargetsParam =
  | { type: 'remove' }
  | { type: 'delete'; id: string }
  | { type: 'ensure'; name: string };

type UpdateTargetsResult = {
  targetIds: string[];
  pendingDelete?: { target: NotifiTarget; id: string };
};

/** @description by default, if "undefined", remove the target from targetGroup  */
export const alterTargetGroupImpl = async (
  alterTargetGroupParams: AlterTargetGroupParams,
  service: NotifiService,
): Promise<Types.TargetGroupFragmentFragment> => {
  // NOTE: Only supports single target in each category for now.
  const targetGroups = (await service.getTargetGroups({})).targetGroup;
  const existingTargetGroup = targetGroups?.find(
    (it) => it?.name === alterTargetGroupParams.name,
  );
  if (!existingTargetGroup) throw new Error('Target group not found');

  const removeTargetParam: UpdateTargetsParam = { type: 'remove' };

  const results = await Promise.all([
    updateTargets(
      'email',
      alterTargetGroupParams.email ?? removeTargetParam,
      service,
    ),
    updateTargets(
      'phoneNumber',
      alterTargetGroupParams.phoneNumber ?? removeTargetParam,
      service,
    ),
    updateTargets(
      'telegram',
      alterTargetGroupParams.telegram ?? removeTargetParam,
      service,
    ),
    updateTargets(
      'discord',
      alterTargetGroupParams.discord ?? removeTargetParam,
      service,
    ),
    updateTargets(
      'slack',
      alterTargetGroupParams.slack ?? removeTargetParam,
      service,
    ),
    updateTargets(
      'wallet',
      alterTargetGroupParams.wallet ?? removeTargetParam,
      service,
    ),
  ]);

  // Extract targetIds from results
  const emailTargetIds = results[0].targetIds;
  const smsTargetIds = results[1].targetIds;
  const telegramTargetIds = results[2].targetIds;
  const discordTargetIds = results[3].targetIds;
  const slackChannelTargetIds = results[4].targetIds;
  const walletTargetIds = results[5].targetIds;

  // Collect pending deletes
  const pendingDeletes = results
    .map((r) => r.pendingDelete)
    .filter((d): d is { target: NotifiTarget; id: string } => !!d);

  if (
    areIdsEqual(emailTargetIds, existingTargetGroup.emailTargets ?? []) &&
    areIdsEqual(smsTargetIds, existingTargetGroup.smsTargets ?? []) &&
    areIdsEqual(telegramTargetIds, existingTargetGroup.telegramTargets ?? []) &&
    areIdsEqual(discordTargetIds, existingTargetGroup.discordTargets ?? []) &&
    areIdsEqual(
      slackChannelTargetIds,
      existingTargetGroup.slackChannelTargets ?? [],
    ) &&
    areIdsEqual(walletTargetIds, existingTargetGroup.web3Targets ?? [])
  ) {
    // Execute pending deletes even if target group doesn't need update
    // (target is already removed from group, now we can delete it)
    for (const { target, id } of pendingDeletes) {
      await alterTarget({
        type: 'delete',
        id,
        target,
        service,
      });
    }
    return existingTargetGroup;
  }

  const updateMutation = await service.updateTargetGroup({
    id: existingTargetGroup.id,
    name: existingTargetGroup.name ?? existingTargetGroup.id,
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    discordTargetIds,
    slackChannelTargetIds,
    web3TargetIds: walletTargetIds,
  });
  const updated = updateMutation.updateTargetGroup;

  if (updated === undefined) {
    throw new Error('Failed to update target group');
  }

  // Execute pending deletes after target group is updated
  // (targets have been removed from group, now we can delete them)
  for (const { target, id } of pendingDeletes) {
    await alterTarget({
      type: 'delete',
      id,
      target,
      service,
    });
  }

  return updated;
};

const updateTargets = async (
  type: NotifiTarget,
  updateTargetInGroup: UpdateTargetsParam,
  service: NotifiService,
): Promise<UpdateTargetsResult> => {
  if (updateTargetInGroup.type === 'remove') {
    return { targetIds: [] };
  }

  let targets:
    | (({ id: string } & Record<string, unknown>) | undefined)[]
    | undefined;

  switch (type) {
    case 'email':
      targets = (await service.getEmailTargets({})).emailTarget;
      break;
    case 'phoneNumber':
      targets = (await service.getSmsTargets({})).smsTarget;
      break;
    case 'telegram':
      targets = (await service.getTelegramTargets({})).telegramTarget;
      break;
    case 'discord':
      targets = (await service.getDiscordTargets({})).discordTarget;
      break;
    case 'slack':
      targets = (await service.getSlackChannelTargets({})).slackChannelTargets
        ?.nodes;
      break;
    case 'wallet':
      targets = (await service.getWeb3Targets({})).web3Targets?.nodes;
      break;
  }

  if (
    updateTargetInGroup.type === 'delete' &&
    targets?.find((it) => it?.id === updateTargetInGroup.id)
  ) {
    // Don't delete here! Return pending delete info, will be executed after updateTargetGroup
    return {
      targetIds: [],
      pendingDelete: { target: type, id: updateTargetInGroup.id },
    };
  }
  if (updateTargetInGroup.type === 'ensure') {
    const target = targets?.find((it) => it?.name === updateTargetInGroup.name);
    if (target) {
      return { targetIds: [target.id] };
    }
    const created = await alterTarget({
      type: 'create',
      value: updateTargetInGroup.name,
      target: type,
      service: service,
    });
    if (!created) throw new Error('Failed to create target');
    return { targetIds: [created] };
  }
  /* Remove from Group (type === 'remove') */
  return { targetIds: [] };
};
