import { gql } from 'graphql-request';

import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';

export const SendEmailTargetVerificationRequest = gql`
  mutation sendEmailTargetVerificationRequest($targetId: String!) {
    sendEmailTargetVerificationRequest(
      sendTargetConfirmationRequestInput: { targetId: $targetId }
    ) {
      ...EmailTargetFragment
    }
  }
  ${EmailTargetFragment}
`;
