import { Types } from '@notifi-network/notifi-graphql';

/**
 * Target object for Telegram accounts
 *
 * @remarks
 * Target object for Telegram accounts
 *
 * @property {string | null} id - Id of the TelegramTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string | null} telegramId - Telegram account for the Target
 * @property {boolean} isConfirmed - Is confirmed? After adding, it must be confirmed via Telegram app by the user
 * @property {string | null} confirmationUrl - If not confirmed, use this URL to allow the user to start the Telegram bot
 *
 */
export type TelegramTarget = Types.TelegramTargetFragmentFragment;
