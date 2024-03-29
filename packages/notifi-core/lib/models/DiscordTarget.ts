/**
 * Target object for discord
 *
 * @remarks
 * Target object for discord
 *
 * @property {string | null} id - Id of the discordTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string | null} discordAccountId - discord account id for the Target
 * @property {string | null} discriminator -  also known as a Discord tag, is part of the way to identify a user. When a user creates a Discord account, they get a random discriminator.
 * @property {boolean} isConfirmed - Is discord confirmed? After adding a discord account, it must be confirmed
 *
 */
import { Types } from '@notifi-network/notifi-graphql';

export enum DiscordTargetStatus {
  UNVERIFIED = 'UNVERIFIED',
  DISCORD_SERVER_NOT_JOINED = 'DISCORD_SERVER_NOT_JOINED',
  COMPLETE = 'COMPLETE',
}

export type DiscordTarget = Types.DiscordTargetFragmentFragment;
