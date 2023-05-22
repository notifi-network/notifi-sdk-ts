import { Types } from '@notifi-network/notifi-graphql';

/**
 * Object describing a SourceGroup
 *
 * @remarks
 * Object describing a SourceGroup
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {Source[]} sources - The Sources associated with the SourceGroup
 *
 */

// Infer the fetched Alter type (Reason: the underlying type of targetGroup element not matching Types.TargetGroup)
export type SourceGroup = Types.SourceGroupFragmentFragment;
