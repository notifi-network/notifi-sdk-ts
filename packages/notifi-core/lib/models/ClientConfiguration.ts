import { TargetType } from './TargetType';

/**
 * Configuration object
 *
 * @remarks
 * Contains configuration relevant to a particular user or dapp
 *
 * @property {TargetType[]} supportedTargetTypes - the supported target types
 * @property {string[]} supportedSmsCountryCodes - The two-letter codes of the countries supported for SMS
 *
 */
export type ClientConfiguration = Readonly<{
  supportedTargetTypes: ReadonlyArray<TargetType>;
  supportedSmsCountryCodes: ReadonlyArray<string>;
}>;
