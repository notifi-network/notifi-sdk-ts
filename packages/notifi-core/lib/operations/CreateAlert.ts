import { Alert, Operation } from '../models';

export type CreateAlertInput = Readonly<{
  name: string;
  sourceGroupId: string;
  filterId: string;
  targetGroupId: string;
  filterOptions: string;
}>;

export type CreateAlertResult = Alert;

export type CreateAlertService = Readonly<{
  createAlert: Operation<CreateAlertInput, CreateAlertResult>;
}>;
