import { Filter } from './Filter';
import { SourceGroup } from './SourceGroup';
import { TargetGroup } from './TargetGroup';

/**
 * Object describing an Alert
 *
 * @remarks
 * Object describing a Alert
 *
 * @property {string | null} id - Id of the Alert
 * @property {string | null} name - Friendly name (must be unique)
 * @property {Filter} filter - The filter associated with this alert
 * @property {SourceGroup} sourceGroup - The sourceGroup associated with this alert
 * @property {TargetGroup} targetGroup - The targetGroup associated with this alert
 *
 */
export type Alert = Readonly<{
  id: string | null;
  name: string | null;
  filter: Filter;
  sourceGroup: SourceGroup;
  targetGroup: TargetGroup;
}>;
