import { Types } from '@notifi-network/notifi-graphql';
import { useClient } from '@xmtp/react-sdk';
import React from 'react';

import { useNotifiFrontendClientContext } from '../context';
import {
  getWalletTargetSignMessage,
  reformatSignatureForWalletTarget,
} from '../utils';
import { createCoinbaseNonce, subscribeCoinbaseMessaging } from '../utils/xmtp';

export const useTargetWallet = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const { frontendClient, walletWithSignParams } =
    useNotifiFrontendClientContext();
  const xmtp = useClient();
  const getSignature = React.useCallback(
    async (message: Uint8Array | string) => {
      let signature: Uint8Array | string = '';

      if (typeof message === 'string') {
        const encoder = new TextEncoder();
        message = encoder.encode(message);
      }

      // TODO: Add logic for rest of the chains
      switch (walletWithSignParams.walletBlockchain) {
        case 'AVALANCHE':
        case 'ETHEREUM':
        case 'POLYGON':
        case 'ARBITRUM':
        case 'BINANCE':
        case 'ELYS':
        case 'NEUTRON':
        case 'ARCHWAY':
        case 'AXELAR':
        case 'BERACHAIN':
        case 'OPTIMISM':
        case 'ZKSYNC':
        case 'INJECTIVE':
        case 'BASE':
        case 'BLAST':
        case 'CELO':
        case 'MANTLE':
        case 'LINEA':
        case 'SCROLL':
        case 'MANTA':
        case 'EVMOS':
        case 'MONAD':
        case 'AGORIC':
        case 'ORAI':
        case 'KAVA':
        case 'CELESTIA':
        case 'COSMOS':
        case 'DYMENSION':
        case 'DYDX':
        case 'XION':
        case 'NEAR':
        case 'SUI':
          signature = await walletWithSignParams.signMessage(message);
          break;
        default: {
          setError(Error('This chain is not supported'));
          throw Error('This chain is not supported');
        }
      }
      return reformatSignatureForWalletTarget(signature);
    },
    [walletWithSignParams.signMessage],
  );

  const xmtpXip42Impl = React.useCallback(
    async (senderAddress: string) => {
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
          'xmtpXip42Impl: XMTP client is uninitialized. Please try again.',
        );
      }
      // NOTE: 2nd signature: create a new XMTP conversation with the tenant sender (will skip if ever signed before)
      const conversation =
        await client.conversations.newConversation(senderAddress);

      await client.contacts.allow([senderAddress]);

      return conversation.topic.split('/')[3];
    },
    [walletWithSignParams.walletPublicKey, xmtp, getSignature],
  );

  const signCoinbaseSignature = React.useCallback(
    async (
      web3TargetId: Types.Web3Target['id'],
      senderAddress: string,
    ): Promise<Types.Web3TargetFragmentFragment | undefined> => {
      setIsLoading(true);
      try {
        const conversationTopic = await xmtpXip42Impl(senderAddress);
        if (!conversationTopic)
          throw Error('Unable to get the conversation topic');

        const address = walletWithSignParams.walletPublicKey;
        const nonce = await createCoinbaseNonce();

        const message = getWalletTargetSignMessage(
          address,
          senderAddress,
          nonce,
        );

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
        console.error('error in signCoinbaseSignature: ', e);
        setError(
          e instanceof Error
            ? {
                ...e,
                message:
                  'useTargetWallet - signCoinbaseSignature: ' + e.message,
              }
            : Error('signCoinbaseSignature: Error occurred, please try again.'),
        );
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [
      walletWithSignParams.walletPublicKey,
      frontendClient,
      xmtpXip42Impl,
      getSignature,
    ],
  );

  return {
    isLoading,
    error,
    signCoinbaseSignature,
  };

  // NOTE && TODO: Temporarily commenting out this function because it will be needed later
  // const xip43Impl = async () => {

  //   const targetId = targetData?.wallet?.data?.id ?? '';
  //   const address = '';

  //   const timestamp = Date.now();
  //   const message = createConsentMessage(senderAddress, timestamp);
  //   const signature = '';

  //   if (!signature) {
  //     throw Error('Unable to sign the wallet. Please try again.');
  //   }

  //   await frontendClient.verifyXmtpTarget({
  //     input: {
  //       web3TargetId: targetId,
  //       accountId: address,
  //       consentProofSignature: signature as string,
  //       timestamp: timestamp,
  //       isCBW: true,
  //     },
  //   });
  //   // await signCoinbaseSignature(address, senderAddress);
  //   await frontendClient.verifyCbwTarget({
  //     input: {
  //       targetId: targetId,
  //     },
  //   });
  // };
};
