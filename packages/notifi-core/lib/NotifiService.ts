import * as Operations from './operations';

export type NotifiService = Operations.CreateAlertService &
  Operations.CreateEmailTargetService &
  Operations.CreateSmsTargetService &
  Operations.CreateSourceGroupService &
  Operations.CreateTargetGroupService &
  Operations.CreateTelegramTargetService &
  Operations.DeleteAlertService &
  Operations.DeleteSourceGroupService &
  Operations.DeleteTargetGroupService &
  Operations.GetAlertsService &
  Operations.GetEmailTargetsService &
  Operations.GetFiltersService &
  Operations.GetSmsTargetsService &
  Operations.GetSourcesService &
  Operations.GetSourceGroupsService &
  Operations.GetTargetGroupsService &
  Operations.GetTelegramTargetsService &
  Operations.LogInFromDappService &
  Operations.UpdateTargetGroupService &
  Readonly<{
    setJwt: (jwt: string | null) => void;
  }>;
