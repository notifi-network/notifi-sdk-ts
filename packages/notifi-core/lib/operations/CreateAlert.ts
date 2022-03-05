import { Alert, Operation } from '../models';

export type CreateAlertInput = Readonly<{
  sourceGroupId: string;
  filterId: string;
  targetGroupId: string;
}>;

export type CreateAlertResult = Alert;

export type CreateAlertService = Readonly<{
  createAlert: Operation<CreateAlertInput, CreateAlertResult>;
}>;
