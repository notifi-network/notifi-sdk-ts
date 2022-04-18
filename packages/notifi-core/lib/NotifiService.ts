import * as Operations from './operations';

export type NotifiService = Operations.CreateAlertService &
  Operations.CreateEmailTargetService &
  Operations.CreateSmsTargetService &
  Operations.CreateSourceService &
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
  Operations.GetSupportedTargetTypesForDappService &
  Operations.GetTargetGroupsService &
  Operations.GetTelegramTargetsService &
  Operations.LogInFromDappService &
  Operations.UpdateSourceGroupService &
  Operations.UpdateTargetGroupService &
  Readonly<{
    setJwt: (jwt: string | null) => void;
  }>;
