import { gql } from 'graphql-request';

export const GetConfigurationForDapp = gql`
  query getConfigurationForDapp($dappAddress: String!) {
    configurationForDapp(
      getConfigurationForDappInput: { dappAddress: $dappAddress }
    ) {
      supportedSmsCountryCodes
      supportedTargetTypes
    }
  }
`;
