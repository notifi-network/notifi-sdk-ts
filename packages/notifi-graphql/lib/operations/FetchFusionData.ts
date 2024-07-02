import {
  FetchFusionDataQuery,
  FetchFusionDataQueryVariables,
} from '../gql/generated';

export type FetchFusionDataService = Readonly<{
  fetchFusionData: (
    variables: FetchFusionDataQueryVariables,
  ) => Promise<FetchFusionDataQuery>;
}>;
