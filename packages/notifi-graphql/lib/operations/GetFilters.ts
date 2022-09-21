import type {
  GetFiltersQuery,
  GetFiltersQueryVariables,
} from '../gql/generated';

export type GetFiltersService = Readonly<{
  getFilters: (variables: GetFiltersQueryVariables) => Promise<GetFiltersQuery>;
}>;
