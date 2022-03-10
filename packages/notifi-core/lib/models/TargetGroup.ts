import { EmailTarget } from './EmailTarget';
import { SmsTarget } from './SmsTarget';
import { TelegramTarget } from './TelegramTarget';

/**
 * Object describing a TargetGroup
 *
 * @remarks
 * Object describing a TargetGroup
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {EmailTarget[] | null} emailTargets - Array of emailTargets
 * @property {SmsTarget[] | null} smsTargets - Array of smsTargets
 * @property {TelegramTarget[] | null} telegramTargets - Array of telegramTargets
 *
 */
export type TargetGroup = Readonly<{
  emailTargets: ReadonlyArray<EmailTarget>;
  id: string | null;
  name: string | null;
  smsTargets: ReadonlyArray<SmsTarget>;
  telegramTargets: ReadonlyArray<TelegramTarget>;
}>;
