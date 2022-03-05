import { SmsTarget } from './SmsTarget';
import { EmailTarget } from './EmailTarget';
import { TelegramTarget } from './TelegramTarget';

export type TargetGroup = Readonly<{
  emailTargets: ReadonlyArray<EmailTarget>;
  id: string | null;
  name: string | null;
  smsTargets: ReadonlyArray<SmsTarget>;
  telegramTargets: ReadonlyArray<TelegramTarget>;
}>;
