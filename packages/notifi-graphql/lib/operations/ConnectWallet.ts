import {
  ConnectWalletMutation,
  ConnectWalletMutationVariables,
} from '../gql/generated';

export type ConnectWalletService = Readonly<{
  connectWallet: (
    variables: ConnectWalletMutationVariables,
  ) => Promise<ConnectWalletMutation>;
}>;
