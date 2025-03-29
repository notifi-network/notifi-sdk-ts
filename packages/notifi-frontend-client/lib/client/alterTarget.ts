import { NotifiService } from '@notifi-network/notifi-graphql';

export type NotifiTarget =
  | 'email'
  | 'phoneNumber'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'wallet';

type CreateTarget = {
  type: 'create';
  value: string;
  target: NotifiTarget;
  service: NotifiService;
};

type DeleteTarget = {
  type: 'delete';
  id: string;
  target: NotifiTarget;
  service: NotifiService;
};

type AlterTarget = CreateTarget | DeleteTarget;

export const alterTarget = async (
  alterTarget: AlterTarget,
): Promise<string | undefined> => {
  const alterTargetService = alterTarget.service;
  if (alterTarget.type === 'create') {
    switch (alterTarget.target) {
      case 'email': {
        const emailTargetMutation = await alterTargetService.createEmailTarget({
          name: alterTarget.value,
          value: alterTarget.value,
        });
        return emailTargetMutation.createEmailTarget?.id;
      }
      case 'phoneNumber': {
        const smsTargetMutation = await alterTargetService.createSmsTarget({
          name: alterTarget.value,
          value: alterTarget.value,
        });
        return smsTargetMutation.createSmsTarget?.id;
      }
      case 'telegram': {
        const telegramTargetMutation =
          await alterTargetService.createTelegramTarget({
            name: alterTarget.value,
            value: alterTarget.value,
          });
        return telegramTargetMutation.createTelegramTarget?.id;
      }
      case 'discord': {
        const discordTargetMutation =
          await alterTargetService.createDiscordTarget({
            name: alterTarget.value,
            value: alterTarget.value,
          });
        return discordTargetMutation.createDiscordTarget?.id;
      }
      case 'slack': {
        const slackChannelTargetMutation =
          await alterTargetService.createSlackChannelTarget({
            name: alterTarget.value,
            value: alterTarget.value,
          });
        return slackChannelTargetMutation.createSlackChannelTarget
          .slackChannelTarget?.id;
      }
      case 'wallet': {
        const web3TargetMutation = await alterTargetService.createWeb3Target({
          name: alterTarget.value,
          accountId: '',
          walletBlockchain: 'OFF_CHAIN',
          web3TargetProtocol: 'XMTP',
        });
        return web3TargetMutation.createWeb3Target?.id;
      }
    }
  }
  if (alterTarget.type === 'delete') {
    switch (alterTarget.target) {
      case 'email':
        await alterTargetService.deleteEmailTarget({
          id: alterTarget.id,
        });
        return;
      case 'phoneNumber':
        await alterTargetService.deleteSmsTarget({
          id: alterTarget.id,
        });
        return;
      case 'telegram':
        await alterTargetService.deleteTelegramTarget({
          id: alterTarget.id,
        });
        return;
      case 'discord':
        await alterTargetService.deleteDiscordTarget({
          id: alterTarget.id,
        });
        return;
      case 'slack':
        await alterTargetService.deleteSlackChannelTarget({
          id: alterTarget.id,
        });
        return;
      case 'wallet':
        await alterTargetService.deleteWeb3Target({
          id: alterTarget.id,
        });
        return;
    }
  }
};
