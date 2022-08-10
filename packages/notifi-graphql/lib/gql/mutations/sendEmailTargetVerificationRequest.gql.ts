import { EmailTargetFragment } from '../fragments/EmailTargetFragment.gql';
import { gql } from 'graphql-request';

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
