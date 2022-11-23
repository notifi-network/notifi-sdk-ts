import { Authorization, ParameterLessOperation } from '../models';

export type CreateSupportResult = Authorization;

export type CreateSupportService = Readonly<{
  createSupport: ParameterLessOperation<CreateSupportResult>;
}>;
