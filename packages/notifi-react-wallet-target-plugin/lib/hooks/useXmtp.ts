import {
  NotifiFrontendClient,
  isUsingEvmBlockchain,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { useClient } from '@xmtp/react-sdk';
import React from 'react';

import { NotifiWalletTargetProviderProps } from '../context';
import {
  createCoinbaseNonce,
  getMessage,
  reformatSignature,
  subscribeCoinbaseMessaging,
} from '../utils';

export type UseXmptInput = NotifiWalletTargetProviderProps;

export const useXmpt = (input: UseXmptInput) => {
  const { walletWithSignParams } = input;
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const authMethod =
    walletWithSignParams.walletBlockchain === 'OFF_CHAIN'
      ? walletWithSignParams.signIn
      : walletWithSignParams.signMessage;
  const xmtp = useClient();

  const getSignature = React.useCallback(
    async (message: Uint8Array | string) => {
      if (walletWithSignParams.walletBlockchain === 'OFF_CHAIN') {
        setError(Error('.getSignature: ERROR - OFF_CHAIN is not supported'));
        return '.getSignature: ERROR - OFF_CHAIN is not supported';
      }

      let signature: Uint8Array | string = '';

      if (typeof message === 'string') {
        const encoder = new TextEncoder();
        message = encoder.encode(message);
      }

      if (isUsingEvmBlockchain(walletWithSignParams)) {
        signature = await walletWithSignParams.signMessage(message);
      } else {
        setError(Error('.getSignature: ERROR - This chain is not supported'));
        console.error('.getSignature: ERROR - This chain is not supported');
      }
      return reformatSignature(signature);
    },
    [authMethod],
  );

  const xmtpXip42Impl = React.useCallback(
    async (senderAddress: string) => {
      if (walletWithSignParams.walletBlockchain === 'OFF_CHAIN') {
        setError(Error('.getSignature: ERROR - OFF_CHAIN is not supported'));
        return '.getSignature: ERROR - OFF_CHAIN is not supported';
      }
      type XmtpInitOption = (typeof xmtp.initialize extends (a: infer U) => void
        ? U
        : never)['options'];

      const options: XmtpInitOption = {
        persistConversations: false,
        env: 'production',
      };
      const address = walletWithSignParams.walletPublicKey;

      const signer = {
        getAddress: (): Promise<string> => {
          return new Promise((resolve) => {
            resolve(address);
          });
        },
        signMessage: async (message: Uint8Array | string): Promise<string> => {
          return getSignature(message);
        },
      };
      // NOTE: 1st signature: init XMTP with user wallet (need sign every time)
      const client = await xmtp.initialize({ options, signer });
      if (!client) {
        throw Error(
          'xmtpXip42Impl: ERROR - XMTP client is uninitialized. Please try again.',
        );
      }
      // NOTE: 2nd signature: create a new XMTP conversation with the tenant sender (will skip if ever signed before)
      const conversation =
        await client.conversations.newConversation(senderAddress);

      await client.contacts.allow([senderAddress]);

      return conversation.topic.split('/')[3];
    },
    [xmtp, getSignature],
  );

  const signCoinbaseSignature = React.useCallback(
    async (
      frontendClient: NotifiFrontendClient,
      web3TargetId: Types.Web3Target['id'],
      senderAddress: string,
    ): Promise<Types.Web3TargetFragmentFragment | undefined> => {
      if (walletWithSignParams.walletBlockchain === 'OFF_CHAIN') {
        setError(Error('.getSignature: ERROR - OFF_CHAIN is not supported'));
        return;
      }
      setIsLoading(true);
      try {
        const conversationTopic = await xmtpXip42Impl(senderAddress);
        if (!conversationTopic)
          throw Error('Unable to get the conversation topic');

        const address = walletWithSignParams.walletPublicKey;
        const nonce = await createCoinbaseNonce();

        const message = getMessage(address, senderAddress, nonce);

        // NOTE: 3rd signature: sign the notifi message above to sync with Notifi BE
        const signature = await getSignature(message);

        if (!signature)
          throw Error('Unable to sign the wallet. Please try again.');

        const payload = {
          address,
          nonce,
          signature: signature as `0x${string}`,
          isActivatedViaCb: true,
          partnerAddress: senderAddress,
          conversationTopic,
        };
        await subscribeCoinbaseMessaging(payload);
        const walletVerifyResult =
          await frontendClient.verifyXmtpTargetViaXip42({
            input: {
              web3TargetId: web3TargetId,
              accountId: address,
              conversationTopic,
            },
          });

        return walletVerifyResult.verifyXmtpTargetViaXip42.web3Target;
      } catch (e) {
        console.error('.signCoinbaseSignature: ERROR - ', e);
        setError(
          e instanceof Error
            ? {
                ...e,
                message: '.signCoinbaseSignature: ERROR - ' + e.message,
              }
            : Error('.signCoinbaseSignature: ERROR - please try again.'),
        );
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [xmtpXip42Impl],
  );
  return {
    isLoading,
    error,
    signCoinbaseSignature,
  };
};
