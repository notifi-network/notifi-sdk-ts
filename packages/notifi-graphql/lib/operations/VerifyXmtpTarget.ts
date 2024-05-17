import {
  VerifyXmtpTargetMutation,
  VerifyXmtpTargetMutationVariables,
} from '../gql/generated';

export type VerifyXmtpTargetService = Readonly<{
  verifyXmtpTarget: (
    variables: VerifyXmtpTargetMutationVariables,
  ) => Promise<VerifyXmtpTargetMutation>;
}>;
