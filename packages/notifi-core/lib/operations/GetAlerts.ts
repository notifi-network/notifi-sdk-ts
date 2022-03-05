import { Alert, ParameterLessOperation } from '../models';

export type GetAlertsResult = ReadonlyArray<Alert>;

export type GetAlertsService = Readonly<{
  getAlerts: ParameterLessOperation<GetAlertsResult>;
}>;
