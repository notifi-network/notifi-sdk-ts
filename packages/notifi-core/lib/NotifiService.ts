import * as Operations from './operations';

export type NotifiService = Operations.BroadcastMessageService &
  Operations.BeginLogInByTransactionService &
  Operations.CompleteLogInByTransactionService &
  Operations.ConnectWalletService &
  Operations.CreateAlertService &
  Operations.CreateEmailTargetService &
  Operations.CreateSmsTargetService &
  Operations.CreateSourceService &
  Operations.CreateSourceGroupService &
  Operations.CreateSupportConversationService &
  Operations.CreateTargetGroupService &
  Operations.CreateTelegramTargetService &
  Operations.CreateWebhookTargetService &
  Operations.DeleteAlertService &
  Operations.DeleteSourceGroupService &
  Operations.DeleteTargetGroupService &
  Operations.FindTenantConfigService &
  Operations.GetAlertsService &
  Operations.GetConfigurationForDappService &
  Operations.GetConnectedWalletsService &
  Operations.GetConversationMessagesService &
  Operations.GetEmailTargetsService &
  Operations.GetFiltersService &
  Operations.GetNotificationHistoryService &
  Operations.GetSmsTargetsService &
  Operations.GetSourcesService &
  Operations.GetSourceGroupsService &
  Operations.GetTargetGroupsService &
  Operations.GetTelegramTargetsService &
  Operations.GetTopicsService &
  Operations.GetWebhookTargetsService &
  Operations.LogInFromDappService &
  Operations.RefreshAuthorizationService &
  Operations.SendConversationMessagesService &
  Operations.SendEmailTargetVerificationRequestService &
  Operations.UpdateSourceGroupService &
  Operations.UpdateTargetGroupService &
  Operations.CreateDiscordTargetService &
  Operations.GetDiscordTargetsService &
  Operations.GetDiscordTargetVerificationLinkService &
  Readonly<{
    setJwt: (jwt: string | null) => void;
  }>;
