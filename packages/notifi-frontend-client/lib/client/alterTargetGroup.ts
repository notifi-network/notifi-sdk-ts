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

  let emailTargetIds: string[] | [] = [];
  if (alterTargetGroup.email.type !== 'remove') {
    const email = alterTargetGroup.email;
    const targets = (await service.getEmailTargets({})).emailTarget;
    if (email.type === 'delete') {
      alterTarget({
        type: email.type,
        id: email.id,
        target: 'email',
        service: service,
      });
    }
    if (email.type === 'ensure') {
      const target = targets?.find((it) => it?.name === email.targetName);
      if (target !== undefined) {
        emailTargetIds = [target.id];
      }
      const created = await alterTarget({
        type: 'create',
        value: email.targetName,
        target: 'email',
        service: service,
      });
      if (!created) throw new Error('Failed to create target');
      emailTargetIds = [created];
    }
  }

  let smsTargetIds: string[] | [] = [];
  // TODO: Implement
  let telegramTargetIds: string[] | [] = [];
  // TODO: Implement
  let discordTargetIds: string[] | [] = [];
  if (alterTargetGroup.discord.type !== 'remove') {
    const discord = alterTargetGroup.discord;
    const targets = (await service.getDiscordTargets({})).discordTarget;
    if (discord.type === 'delete') {
      alterTarget({
        type: discord.type,
        id: discord.id,
        target: 'discord',
        service: service,
      });
    }
    if (discord.type === 'ensure') {
      const target = targets?.find((it) => it?.name === discord.targetName);
      if (target !== undefined) {
        discordTargetIds = [target.id];
      } else {
        const created = await alterTarget({
          type: 'create',
          value: discord.targetName,
          target: 'discord',
          service: service,
        });
        if (!created) throw new Error('Failed to create target');
        discordTargetIds = [created];
      }
    }
  }
  let slackChannelTargetIds: string[] | [] = [];
  // TODO: Implement
  let walletTargetIds: string[] | [] = [];
  // TODO: Implement

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
