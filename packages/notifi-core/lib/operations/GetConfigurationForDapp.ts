import { Operation, TargetType } from '../models';

export type GetConfigurationForDappInput = Readonly<{
  dappAddress: string;
}>;

export type GetConfigurationForDappResult = Readonly<{
  supportedTargetTypes: ReadonlyArray<TargetType>;
  supportedSmsCountryCodes: ReadonlyArray<string>;
}>;

export type GetConfigurationForDappService = Readonly<{
  getConfigurationForDapp: Operation<
    GetConfigurationForDappInput,
    GetConfigurationForDappResult
  >;
}>;
