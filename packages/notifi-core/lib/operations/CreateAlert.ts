import { Alert, Operation } from '../models';

/**
 * Input param for creating an Alert
 * 
 * @remarks
 * This describes the Alert to be created from previously obtained sourceGroup, filter and targetGroup
 * 
 * @property sourceGroupId - The id from the SourceGroup that should be monitored
 * @property filterId - The id of the Filter that should be applied to the Alert
 * @property targetGroupId - The id of the TargetGroup that the Alert should publish to
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */
export type CreateAlertInput = Readonly<{
  sourceGroupId: string;
  filterId: string;
  targetGroupId: string;
}>;

export type CreateAlertResult = Alert;

export type CreateAlertService = Readonly<{
  createAlert: Operation<CreateAlertInput, CreateAlertResult>;
}>;
