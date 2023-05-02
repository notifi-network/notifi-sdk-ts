import { Types } from '@notifi-network/notifi-graphql';

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
 * @property {DiscordTarget[] | null} discordTargets - Array of discordTargets
 *
 */
export type TargetGroup = Types.TargetGroup;
