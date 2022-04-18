import {
  supportedTargetTypesFragment,
  supportedTargetTypesFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetSupportedTargetTypesResult } from '@notifi-network/notifi-core';

const DEPENDENCIES = [
  ...supportedTargetTypesFragmentDependencies,
  supportedTargetTypesFragment,
];

const MUTATION = `
query getSupportedTargetTypesForDapp {
  supportedTargetTypesForDapp {
    ...supportedTargetTypesFragment
  }
}
`.trim();

const getSupportedTargetTypesForDappImpl =
  makeParameterLessRequest<GetSupportedTargetTypesResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'supportedTargetTypesFromDapp',
  );

export default getSupportedTargetTypesForDappImpl;
