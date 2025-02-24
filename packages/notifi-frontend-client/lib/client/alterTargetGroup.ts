import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import { areIdsEqual } from '../utils/areIdsEqual';
import { alterTarget } from './alterTarget';

// TODO: remove and reuse
type Target =
  | 'email'
  | 'phoneNumber'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'wallet';
export type AlterTargetGroup = Readonly<
  {
    name: string;
  } & Record<Target, UpdateTargetInGroup>
>;
export type UpdateTargetInGroup =
  | { type: 'remove' }
  | { type: 'delete'; id: string }
  | { type: 'ensure'; targetName: string };

export const alterTargetGroupImpl = async (
  alterTargetGroup: AlterTargetGroup,
  service: NotifiService,
): Promise<Types.TargetGroupFragmentFragment> => {
  // NOTE: Only supports single target in each category for now.
  const targetGroups = (await service.getTargetGroups({})).targetGroup;
  const existingTargetGroup = targetGroups?.find(
    (it) => it?.name === alterTargetGroup.name,
  );
  if (!existingTargetGroup) throw new Error('Target group not found');

  const emailTargetIds = await updateTargets(
    'email',
    alterTargetGroup.email,
    service,
  );

  const smsTargetIds = await updateTargets(
    'phoneNumber',
    alterTargetGroup.phoneNumber,
    service,
  );

  const telegramTargetIds = await updateTargets(
    'telegram',
    alterTargetGroup.telegram,
    service,
  );
  const discordTargetIds = await updateTargets(
    'discord',
    alterTargetGroup.discord,
    service,
  );
  const slackChannelTargetIds = await updateTargets(
    'slack',
    alterTargetGroup.slack,
    service,
  );
  const walletTargetIds = await updateTargets(
    'wallet',
    alterTargetGroup.wallet,
    service,
  );

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
    webhookTargetIds: [], // Webhook target is deprecated
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
  type: Target,
  updateTargetInGroup: UpdateTargetInGroup,
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
    const target = targets?.find(
      (it) => it?.name === updateTargetInGroup.targetName,
    );
    if (!!target) {
      return [target.id];
    }
    const created = await alterTarget({
      type: 'create',
      value: updateTargetInGroup.targetName,
      target: type,
      service: service,
    });
    if (!created) throw new Error('Failed to create target');
    return [created];
  }
  // TODO: review all cases again
  return [];
};
