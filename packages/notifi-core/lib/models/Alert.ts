import { Filter } from './Filter';
import { SourceGroup } from './SourceGroup';
import { TargetGroup } from './TargetGroup';

export type Alert = Readonly<{
  id: string | null;
  name: string | null;
  filter: Filter;
  sourceGroup: SourceGroup;
  targetGroup: TargetGroup;
}>;
