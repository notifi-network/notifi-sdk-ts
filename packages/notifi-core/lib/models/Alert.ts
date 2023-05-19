import { Types } from '@notifi-network/notifi-graphql';

/**
 * Object describing an Alert
 *
 * @remarks
 * Object describing a Alert
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {Filter} filter - The filter associated with this alert
 * @property {string} filterOptions - The filter options associated with the alert
 * @property {SourceGroup} sourceGroup - The sourceGroup associated with this alert
 * @property {TargetGroup} targetGroup - The targetGroup associated with this alert
 * @property {string | null} groupName - The group associated with this alert
 *
 */

// Infer the fetched Alter type (Reason: the underlying type of target element ans sourceGroup not matching Gql types)
export type Alert = Types.AlertFragmentFragment;
