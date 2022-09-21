import type { GetTopicsQuery, GetTopicsQueryVariables } from '../gql/generated';

export type GetTopicsService = Readonly<{
  getTopics: (variables: GetTopicsQueryVariables) => Promise<GetTopicsQuery>;
}>;
