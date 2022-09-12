import * as Operations from './operations';

export type NotifiService = Operations.BroadcastMessageService &
  Operations.BeginLogInByTransactionService &
  Operations.CompleteLogInByTransactionService &
  Operations.CreateAlertService &
  Operations.CreateEmailTargetService &
  Operations.CreateSmsTargetService &
  Operations.CreateSourceService &
  Operations.CreateSourceGroupService &
  Operations.CreateTargetGroupService &
  Operations.CreateTelegramTargetService &
  Operations.CreateWebhookTargetService &
  Operations.DeleteAlertService &
  Operations.DeleteSourceGroupService &
  Operations.DeleteTargetGroupService &
  Operations.FindTenantConfigService &
  Operations.GetAlertsService &
  Operations.GetConfigurationForDappService &
  Operations.GetEmailTargetsService &
  Operations.GetFiltersService &
  Operations.GetSmsTargetsService &
  Operations.GetSourcesService &
  Operations.GetSourceGroupsService &
  Operations.GetTargetGroupsService &
  Operations.GetTelegramTargetsService &
  Operations.GetTopicsService &
  Operations.GetWebhookTargetsService &
  Operations.LogInFromDappService &
  Operations.RefreshAuthorizationService &
  Operations.SendEmailTargetVerificationRequestService &
  Operations.UpdateSourceGroupService &
  Operations.UpdateTargetGroupService &
  Readonly<{
    setJwt: (jwt: string | null) => void;
  }>;
