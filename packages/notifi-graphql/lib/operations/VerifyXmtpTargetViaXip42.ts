import {
  VerifyXmtpTargetViaXip42Mutation,
  VerifyXmtpTargetViaXip42MutationVariables
} from '../gql/generated';

export type VerifyXmtpTargetViaXip42Service = Readonly<{
  verifyXmtpTargetViaXip42: (
    variables: VerifyXmtpTargetViaXip42MutationVariables,
  ) => Promise<VerifyXmtpTargetViaXip42Mutation>;
}>;
