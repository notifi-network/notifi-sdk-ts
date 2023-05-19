import { Types } from '@notifi-network/notifi-graphql';

/**
 * Target object for email addresses
 *
 * @remarks
 * Target object for email addresses
 *
 * @property {string | null} id - Id of the emailTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string | null} emailAddress - Email address for the Target
 * @property {boolean} isConfirmed - Is email address confirmed? After adding an email address, it must be confirmed
 *
 */
export type EmailTarget = Types.FetchDataQuery['emailTarget'] extends infer R
  ? R extends Array<infer V>
    ? NonNullable<V>
    : never
  : never;
