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
  $filterOptions: String!
  $groupName: String
) {
  createAlert(
    alertInput: {
      name: $name
      sourceGroupId: $sourceGroupId
      filterId: $filterId
      targetGroupId: $targetGroupId
      filterOptions: $filterOptions
      groupName: $groupName
    }
  ) {
    ...alertFragment
  }
}
`.trim();

const createAlertImpl = makeRequest<CreateAlertInput, CreateAlertResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'createAlert',
  (input: CreateAlertInput): Required<CreateAlertInput> => {
    const groupName = input.groupName ?? 'default';
    return {
      ...input,
      groupName
    };
  }
);

export default createAlertImpl;
