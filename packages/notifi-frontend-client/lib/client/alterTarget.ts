import { Operations } from '@notifi-network/notifi-graphql';

type TargetService =
  | Operations.GetEmailTargetsService
  | Operations.GetSmsTargetsService
  | Operations.GetTelegramTargetsService
  | Operations.GetDiscordTargetsService
  | Operations.GetSlackChannelTargetsService
  | Operations.GetWeb3TargetsService
  | Operations.CreateEmailTargetService
  | Operations.CreateSmsTargetService
  | Operations.CreateTelegramTargetService
  | Operations.CreateDiscordTargetService
  | Operations.CreateSlackChannelTargetService
  | Operations.CreateWeb3TargetService
  | Operations.DeleteEmailTargetService;

// TODO: remove and reuse
type Target =
  | 'email'
  | 'phoneNumber'
  | 'telegram'
  | 'discord'
  | 'slack'
  | 'wallet';

// TODO: consolidate
type CreateTarget = {
  type: 'create';
  value: string;
  target: Target;
  service: TargetService;
};

type DeleteTarget = {
  type: 'delete';
  id: string;
  target: Target;
  service: TargetService;
};

type AlterTarget = CreateTarget | DeleteTarget;

export const alterTarget = async (
  alterTarget: AlterTarget,
): Promise<string | undefined> => {
  if (alterTarget.type === 'create') {
    if (alterTarget.target === 'email') {
      const alertService =
        alterTarget.service as Operations.CreateEmailTargetService;
      const mutation = await alertService.createEmailTarget({
        name: alterTarget.value,
        value: alterTarget.value,
      });
      return mutation.createEmailTarget?.id;
    }
    if (alterTarget.target === 'phoneNumber') {
      const alertService =
        alterTarget.service as Operations.CreateSmsTargetService;
      const mutation = await alertService.createSmsTarget({
        name: alterTarget.value,
        value: alterTarget.value,
      });
      return mutation.createSmsTarget?.id;
    }
    if (alterTarget.target === 'telegram') {
      const alertService =
        alterTarget.service as Operations.CreateTelegramTargetService;
      const mutation = await alertService.createTelegramTarget({
        name: alterTarget.value,
        value: alterTarget.value,
      });
      return mutation.createTelegramTarget?.id;
    }
    if (alterTarget.target === 'discord') {
      const alertService =
        alterTarget.service as Operations.CreateDiscordTargetService;
      const mutation = await alertService.createDiscordTarget({
        name: alterTarget.value,
        value: alterTarget.value,
      });
      return mutation.createDiscordTarget?.id;
    }
  }
  if (alterTarget.type === 'delete') {
    if (alterTarget.target === 'email') {
      const alertService =
        alterTarget.service as Operations.DeleteEmailTargetService &
          Operations.GetEmailTargetsService;
      const emailTargets = await alertService.getEmailTargets({});
      const existing = emailTargets.emailTarget?.find(
        (it) => it?.id === alterTarget.id,
      );
      if (!!existing) {
        await alertService.deleteEmailTarget({
          id: alterTarget.id,
        });
      }
      return undefined;
    }
    if (alterTarget.target === 'phoneNumber') {
      const alertService =
        alterTarget.service as Operations.GetSmsTargetsService &
          Operations.DeleteSmsTargetService;
      const smsTargets = await alertService.getSmsTargets({});
      const existing = smsTargets.smsTarget?.find(
        (it) => it?.id === alterTarget.id,
      );
      if (!!existing) {
        await alertService.deleteSmsTarget({
          id: alterTarget.id,
        });
      }
      return undefined;
    }
    if (alterTarget.target === 'telegram') {
      const alertService =
        alterTarget.service as Operations.GetTelegramTargetsService &
          Operations.DeleteTelegramTargetService;
      const telegramTargets = await alertService.getTelegramTargets({});
      const existing = telegramTargets.telegramTarget?.find(
        (it) => it?.id === alterTarget.id,
      );
      if (!!existing) {
        await alertService.deleteTelegramTarget({
          id: alterTarget.id,
        });
      }
      return undefined;
    }
    if (alterTarget.target === 'discord') {
      const alertService =
        alterTarget.service as Operations.GetDiscordTargetsService &
          Operations.DeleteDiscordTargetService;
      const discordTargets = await alertService.getDiscordTargets({});
      const existing = discordTargets.discordTarget?.find(
        (it) => it?.id === alterTarget.id,
      );
      if (!!existing) {
        await alertService.deleteDiscordTarget({
          id: alterTarget.id,
        });
      }
      return undefined;
    }
    if (alterTarget.target === 'slack') {
      const alertService =
        alterTarget.service as Operations.GetSlackChannelTargetsService &
          Operations.DeleteSlackChannelTargetService;
      const slackTargets = await alertService.getSlackChannelTargets({});
      const existing = slackTargets.slackChannelTargets?.nodes?.find(
        (it) => it?.id === alterTarget.id,
      );
      if (!!existing) {
        await alertService.deleteSlackChannelTarget({
          id: alterTarget.id,
        });
      }
      return undefined;
    }
    if (alterTarget.target === 'wallet') {
      const alertService =
        alterTarget.service as Operations.GetWeb3TargetsService &
          Operations.DeleteWeb3TargetService;
      const web3Targets = await alertService.getWeb3Targets({});
      const existing = web3Targets.web3Targets?.nodes?.find(
        (it) => it?.id === alterTarget.id,
      );
      if (!!existing) {
        await alertService.deleteWeb3Target({
          id: alterTarget.id,
        });
      }
      return undefined;
    }
  }
};
