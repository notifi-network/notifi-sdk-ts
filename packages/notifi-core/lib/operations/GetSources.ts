import { Types } from '@notifi-network/notifi-graphql';

import { ParameterLessOperation } from '../models';

export type GetSourcesResult = ReadonlyArray<Types.SourceFragmentFragment>;

export type GetSourcesService = Readonly<{
  getSources: ParameterLessOperation<GetSourcesResult>;
}>;
