import {
  emailTargetFragment,
  emailTargetFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  SendEmailTargetVerificationRequestInput,
  SendEmailTargetVerificationRequestResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...emailTargetFragmentDependencies, emailTargetFragment];

const MUTATION = `
mutation sendEmailTargetVerificationRequest(
  $targetId: String!
) {
  sendEmailTargetVerificationRequest(sendTargetConfirmationRequestInput:{
    targetId: $targetId
  }) {
    ...emailTargetFragment
  }
}
`.trim();

const sendEmailTargetVerificationRequestImpl = makeRequest<
  SendEmailTargetVerificationRequestInput,
  SendEmailTargetVerificationRequestResult
>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'sendEmailTargetVerificationRequest',
);

export default sendEmailTargetVerificationRequestImpl;
