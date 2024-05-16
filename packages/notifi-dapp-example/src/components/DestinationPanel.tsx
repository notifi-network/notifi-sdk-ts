import { Icon } from '@/assets/Icon';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { createCoinbaseNonce, subscribeCoinbaseMessaging } from '@/utils/xmtp';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  isCtaInfo,
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
} from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
// import { createConsentMessage } from '@xmtp/consent-proof-signature';
import { useClient } from '@xmtp/react-sdk';
import React, { useCallback, useMemo, useState } from 'react';

import { CoinbaseInfoModal } from './CoinbaseInfoModal';
import { DestinationInfoPrompt } from './DestinationInfoPrompt';

export type UserInfoSection = {
  container: string;
  label: string;
  confirmationLink: string;
  confirmationLabel: string;
  errorMessageContainer: string;
  errorMessage: string;
  tooltipContent: string;
};

export type DestinationPanelProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  confirmationLabels?: {
    email?: string;
    telegram?: string;
  };
};
export const DestinationPanel: React.FC<DestinationPanelProps> = ({
  contactInfo,
  confirmationLabels,
}) => {
  const [isEmailConfirmationSent, setIsEmailConfirmationSent] =
    useState<boolean>(false);

  const {
    targetDocument: { targetInfoPrompts, targetData },
    refreshTargetDocument,
  } = useNotifiTargetContext();

  const { frontendClient } = useNotifiFrontendClientContext();

  const handleResendEmailVerificationClick = useCallback(() => {
    if (targetInfoPrompts.email?.infoPrompt.type !== 'cta') return;
    setIsEmailConfirmationSent(true);
    targetInfoPrompts.email.infoPrompt.onClick();
    setTimeout(() => setIsEmailConfirmationSent(false), 3000);
  }, [targetInfoPrompts.email]);

  const discordUserName = useMemo(() => {
    const { username, discriminator } = targetData.discord.data || {};

    return discriminator === '0' ? username : `${username}#${discriminator}`;
  }, [targetData.discord.data]);

  const VerifiedText = (
    <div className="font-semibold text-sm text-notifi-success mx-6">
      Verified
    </div>
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isCBInfoModalOpen, setIsCBInfoModalOpen] = useState(false);
  const { wallets, selectedWallet } = useWallets();
  const { popGlobalInfoModal } = useGlobalStateContext();
  const xmtp = useClient();

  // Temporarily commenting out this function because it will be needed later
  // const xip43Impl = async () => {
  //   if (!selectedWallet) {
  //     throw Error('Unable to sign the wallet. Please try again.');
  //   }

  //   const targetId = targetData?.wallet?.data?.id ?? '';
  //   const address =
  //     selectedWallet === 'coinbase'
  //       ? wallets[selectedWallet]?.walletKeys?.hex ?? ''
  //       : '';
  //   // TODO: get senderAddress from target
  //   const senderAddress = '0xb49bbE2c31CF4a0fB74b16812b8c6B6FeEE23524';
  //   const timestamp = Date.now();
  //   const message = createConsentMessage(senderAddress, timestamp);
  //   const signature = await wallets[selectedWallet].signArbitrary(message);

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

  const xmtpXip42Impl = async () => {
    setIsLoading(true);

    try {
      if (!selectedWallet) {
        throw Error('Unable to sign the wallet. Please try again.');
      }

      const options: any = {
        persistConversations: false,
        env: 'production',
      };

      const address =
        selectedWallet === 'coinbase'
          ? wallets[selectedWallet]?.walletKeys?.hex ?? ''
          : '';

      const signer = {
        getAddress: (): Promise<string> => {
          return new Promise((resolve) => {
            resolve(address);
          });
        },
        signMessage: (message: ArrayLike<number> | string): Promise<string> => {
          return wallets[selectedWallet].signArbitrary(
            message as string,
          ) as Promise<string>;
        },
      };

      const client = await xmtp.initialize({ options, signer });

      if (client === undefined) {
        throw Error('XMTP client is uninitialized. Please try again.');
      }

      // TODO: get senderAddress from target
      const senderAddress = '0xb49bbE2c31CF4a0fB74b16812b8c6B6FeEE23524';
      const conversation = await client.conversations.newConversation(
        senderAddress,
      );
      const conversationTopic = conversation.topic.split('/')[3];

      await client.contacts.allow([senderAddress]);

      await signCoinbaseSignature(address, senderAddress, conversationTopic);

      const targetId = targetData?.wallet?.data?.id ?? '';

      await frontendClient.verifyXmtpTargetViaXip42({
        input: {
          web3TargetId: targetId,
          accountId: address,
          conversationTopic,
        },
      });

      await frontendClient
        .fetchData()
        .then(refreshTargetDocument)
        .catch((e) => console.error(e));
    } catch (e) {
      console.error(e);

      popGlobalInfoModal({
        message:
          e instanceof Error && e.message
            ? e.message
            : 'Unable to sign the wallet. Please try again.',
        iconOrEmoji: { type: 'icon', id: 'warning' },
        timeout: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signWallet = async () => {
    await xmtpXip42Impl();
  };

  const signCoinbaseSignature = async (
    address: string,
    senderAddress: string,
    conversationTopic: string,
  ) => {
    const nonce = await createCoinbaseNonce();
    if (!nonce || !selectedWallet)
      throw Error('Unable to sign the wallet. Please try again.');

    const message = `Coinbase Wallet Messaging subscribe\nAddress: ${address}\nPartner Address: ${senderAddress}\nNonce: ${nonce}`;

    const signature = await wallets[selectedWallet].signArbitrary(message);

    if (!signature) throw Error('Unable to sign the wallet. Please try again.');

    const payload = {
      address,
      nonce,
      signature: signature,
      isActivatedViaCb: true,
      partnerAddress: senderAddress,
      conversationTopic,
    };

    return await subscribeCoinbaseMessaging(payload);
  };

  const isWalletAlertVerified = targetData.wallet?.data?.isConfirmed;

  const toggleCBInfoModal = () => {
    setIsCBInfoModalOpen(!isCBInfoModalOpen);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <CoinbaseInfoModal
        handleClose={toggleCBInfoModal}
        open={isCBInfoModalOpen}
      />
      {contactInfo.email.active && targetData.email ? (
        <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="email-icon"
              width="15px"
              height="12px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2 text-notifi-grey-text">
              Email
            </div>
          </div>
          <div
            className={`flex ${
              targetInfoPrompts.email?.infoPrompt.type === 'cta'
                ? 'flex-col'
                : 'flex-row'
            } items-start justify-between w-3/4 sm:w-90 mr-4`}
          >
            <div className="text-sm ml-6 text-notifi-text">
              {targetData.email}
            </div>
            {targetInfoPrompts.email?.infoPrompt.type === 'cta' ? (
              <div className="flex flex-col md:flex-row justify-center items-baseline">
                <div className="text-sm ml-6 mr-1 text-notifi-text-light font-medium">
                  We sent you an email.{' '}
                </div>
                <DestinationInfoPrompt
                  type="email"
                  isSent={isEmailConfirmationSent}
                  onClick={() => handleResendEmailVerificationClick()}
                  infoPromptMessage={
                    isEmailConfirmationSent
                      ? 'Verification email sent'
                      : 'Resend verification email'
                  }
                />
              </div>
            ) : (
              VerifiedText
            )}
          </div>
        </div>
      ) : null}
      {contactInfo.telegram.active && targetData.telegram ? (
        <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="telegram-icon"
              width="16px"
              height="14px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2 text-notifi-grey-text">
              Telegram
            </div>
          </div>

          {targetInfoPrompts.telegram?.infoPrompt.type === 'cta' ? (
            <div className="flex flex-row items-center justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">
                {targetData.telegram}
              </div>
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy="Verify ID"
                onClick={() => {
                  const infoPrompt = targetInfoPrompts.telegram?.infoPrompt;
                  if (infoPrompt && isCtaInfo(infoPrompt)) infoPrompt.onClick();
                }}
                infoPromptMessage={
                  targetInfoPrompts.telegram?.infoPrompt.message ??
                  confirmationLabels?.telegram ??
                  ''
                }
              />
            </div>
          ) : (
            <div className="flex flex-row items-start justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">
                {targetData.telegram}
              </div>
              {VerifiedText}
            </div>
          )}
        </div>
      ) : null}
      {/* {targetData.slack.useSlack ? (
        <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="slack-icon"
              width="16px"
              height="16px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2 text-notifi-grey-text">
              Slack
            </div>
          </div>

          {targetInfoPrompts.slack?.infoPrompt.type === 'cta' ? (
            <div className="flex flex-row items-center justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">Slack</div>
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy="Enable Bot"
                onClick={() => {
                  (targetInfoPrompts.slack?.infoPrompt as CtaInfo).onClick();
                }}
                infoPromptMessage={
                  targetInfoPrompts.slack?.infoPrompt.message ?? ''
                }
              />
            </div>
          ) : (
            <div className="flex flex-row items-start justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">
                {targetData.slack.data?.slackChannelName ?? 'Slack'}
              </div>
              {targetData.slack.data?.verificationStatus === 'VERIFIED'
                ? VerifiedText
                : null}
            </div>
          )}
        </div>
      ) : null} */}

      {contactInfo?.discord?.active && targetData.discord.useDiscord ? (
        <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="discord-icon"
              width="17px"
              height="13px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2 text-notifi-grey-text">
              Discord
            </div>
          </div>

          {targetInfoPrompts.discord?.infoPrompt.type === 'cta' ? (
            <div className="flex flex-row items-center justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">
                Discord Bot DM Alerts
              </div>
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy={targetInfoPrompts.discord?.infoPrompt.message ?? ''}
                onClick={() => {
                  const infoPrompt = targetInfoPrompts.discord?.infoPrompt;
                  if (infoPrompt && isCtaInfo(infoPrompt)) infoPrompt.onClick();
                }}
                infoPromptMessage={
                  targetInfoPrompts.discord?.infoPrompt.message ??
                  confirmationLabels?.telegram ??
                  ''
                }
              />
            </div>
          ) : (
            <div className="flex flex-row items-start justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">
                {targetData.discord.data?.isConfirmed === true
                  ? discordUserName
                  : 'Discord'}
              </div>
              {VerifiedText}
            </div>
          )}
        </div>
      ) : null}

      {targetData.wallet.useWallet ? (
        <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon id="wallet-icon" className="text-notifi-toggle-on-bg" />
            <div className="font-medium text-xs mt-2 text-notifi-grey-text">
              Wallet
            </div>
          </div>

          <div className="flex flex-row items-center justify-between w-3/4 sm:w-90 mr-4">
            <div className="relative flex items-center gap-1.5 text-sm ml-6 text-notifi-text">
              Wallet Alerts
              <button className="group flex items-center justify-center">
                <Icon id="info" style={{ color: '#B6B8D5' }} />
                <div className="w-[194px] bg-black text-white text-start border border-[#565A8D] text-sm font-medium rounded-md p-4 hidden absolute z-10 left-0 bottom-[102%] group-hover:block">
                  {isWalletAlertVerified ? (
                    <>
                      Make sure messages are enabled in your Coinbase Wallet
                      App.{' '}
                      <span
                        onClick={toggleCBInfoModal}
                        className="text-notifi-toggle-on-bg underline cursor-pointer"
                      >
                        More info
                      </span>
                    </>
                  ) : (
                    <>
                      Wallet messages are powered by XMTP and delivered natively
                      into Coinbase Wallet. Download the Coinbase Wallet App or
                      Browser Extension to receive wallet alerts!
                    </>
                  )}
                </div>
              </button>
            </div>

            {targetInfoPrompts.wallet?.infoPrompt.type === 'cta' ? (
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy={targetInfoPrompts.wallet?.infoPrompt.message ?? ''}
                onClick={() => {
                  if (isLoading) return;
                  const infoPrompt = targetInfoPrompts.wallet?.infoPrompt;

                  if (infoPrompt && isCtaInfo(infoPrompt)) {
                    if (infoPrompt.message === 'Sign Wallet') signWallet();
                    else infoPrompt.onClick();
                  }
                }}
                infoPromptMessage={
                  targetInfoPrompts.wallet?.infoPrompt.message ?? ''
                }
              />
            ) : isWalletAlertVerified ? (
              VerifiedText
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
