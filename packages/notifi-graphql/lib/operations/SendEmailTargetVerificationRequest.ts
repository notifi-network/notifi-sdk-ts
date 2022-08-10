import {
  SendEmailTargetVerificationRequestMutation,
  SendEmailTargetVerificationRequestMutationVariables,
} from '../gql/generated';

export type SendEmailTargetVerificationRequestService = Readonly<{
  sendEmailTargetVerificationRequest: (
    variables: SendEmailTargetVerificationRequestMutationVariables,
  ) => Promise<SendEmailTargetVerificationRequestMutation>;
}>;
