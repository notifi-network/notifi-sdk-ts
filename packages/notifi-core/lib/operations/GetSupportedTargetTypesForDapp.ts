import { ParameterLessOperation, TargetType } from '../models';

export type GetSupportedTargetTypesResult = ReadonlyArray<TargetType>;

export type GetSupportedTargetTypesForDappService = Readonly<{
  getSupportedTargetTypesForDapp: ParameterLessOperation<GetSupportedTargetTypesResult>;
}>;
