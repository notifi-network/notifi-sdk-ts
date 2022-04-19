import {
  clientConfigurationFragment,
  clientConfigurationFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  GetConfigurationForDappInput,
  GetConfigurationForDappResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [
  ...clientConfigurationFragmentDependencies,
  clientConfigurationFragment,
];

const QUERY = `
query getConfigurationForDapp($dappAddress: String!) {
  configurationForDapp(getConfigurationForDappInput: {
    dappAddress: $dappAddress
  }) {
    ...clientConfigurationFragment
  }
}
`.trim();

const getConfigurationForDappImpl = makeRequest<
  GetConfigurationForDappInput,
  GetConfigurationForDappResult
>(collectDependencies(...DEPENDENCIES, QUERY), 'configurationForDapp');

export default getConfigurationForDappImpl;
