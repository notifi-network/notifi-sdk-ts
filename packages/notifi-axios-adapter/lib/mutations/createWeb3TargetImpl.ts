import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateWeb3TargetInput,
  CreateWeb3TargetResult,
} from '@notifi-network/notifi-core';

import {
  web3TargetFragment,
  web3TargetFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...web3TargetFragmentDependencies, web3TargetFragment];

const MUTATION = `
mutation CreateWeb3Target(
  $name: String!
  $value: String!
  $targetProtocol: Web3TargetProtocol!
  $walletBlockchain: WalletBlockchain!

) {
  createWeb3Target(
    createTargetInput: {
      name: $name
      value: $value
      walletBlockchain: $walletBlockchain
      targetProtocol: $targetProtocol
    }
  ) {
    ...web3TargetFragment
  }
}
`.trim();

const CreateWeb3TargetImpl = makeRequest<
  CreateWeb3TargetInput,
  CreateWeb3TargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createWeb3Target');

export default CreateWeb3TargetImpl;
