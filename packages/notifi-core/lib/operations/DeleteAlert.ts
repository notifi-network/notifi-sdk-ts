import { Operation } from '../models';

export type DeleteAlertInput = Readonly<{
  id: string;
}>;
export type DeleteAlertResult = Readonly<{
  id: string;
}>;

export type DeleteAlertService = Readonly<{
  deleteAlert: Operation<DeleteAlertInput, DeleteAlertResult>;
}>;
