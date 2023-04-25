import { FetchDataQuery, FetchDataQueryVariables } from '../gql/generated';

export type FetchDataService = Readonly<{
  fetchData: (variables: FetchDataQueryVariables) => Promise<FetchDataQuery>;
}>;
