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

  const [
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    discordTargetIds,
    slackChannelTargetIds,
    walletTargetIds,
  ] = await Promise.all([
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

  return updated;
};

const updateTargets = async (
  type: NotifiTarget,
  updateTargetInGroup: UpdateTargetsParam,
  service: NotifiService,
): Promise<string[]> => {
  if (updateTargetInGroup.type === 'remove') {
    return [];
  }

  let targets: (({ id: string } & Record<any, any>) | undefined)[] | undefined;

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
    await alterTarget({
      type: updateTargetInGroup.type,
      id: updateTargetInGroup.id,
      target: type,
      service: service,
    });
    return [];
  }
  if (updateTargetInGroup.type === 'ensure') {
    const target = targets?.find((it) => it?.name === updateTargetInGroup.name);
    if (!!target) {
      return [target.id];
    }
    const created = await alterTarget({
      type: 'create',
      value: updateTargetInGroup.name,
      target: type,
      service: service,
    });
    if (!created) throw new Error('Failed to create target');
    return [created];
  }
  /* Remove from Group (type === 'remove') */
  return [];
};
