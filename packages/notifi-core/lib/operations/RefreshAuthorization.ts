import { Authorization, ParameterLessOperation } from '../models';

export type RefreshAuthorizationResult = Authorization;

export type RefreshAuthorizationService = Readonly<{
  refreshAuthorization: ParameterLessOperation<RefreshAuthorizationResult>;
}>;
