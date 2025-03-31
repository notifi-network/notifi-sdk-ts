import {
  GetSmartLinkConfigQuery,
  GetSmartLinkConfigQueryVariables,
} from '../gql/generated';

export type GetSmartLinkConfigService = Readonly<{
  getSmartLinkConfig: (
    variables: GetSmartLinkConfigQueryVariables,
  ) => Promise<GetSmartLinkConfigQuery>;
}>;
