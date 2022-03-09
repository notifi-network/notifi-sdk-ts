import {
  CreateAlertInput,
  CreateAlertResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';
import { alertFragment, alertFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...alertFragmentDependencies, alertFragment];

const MUTATION = `
mutation createAlert(
  $name: String!
  $sourceGroupId: String!
  $filterId: String!
  $targetGroupId: String!
) {
  createAlert(
    alertInput: {
      name: $name
      sourceGroupId: $sourceGroupId
      filterId: $filterId
      targetGroupId: $targetGroupId
    }
  ) {
    ...alertFragment
  }
}
`.trim();

const createAlertImpl = makeRequest<CreateAlertInput, CreateAlertResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'createAlert'
);

export default createAlertImpl;
