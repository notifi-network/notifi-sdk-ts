import { Icon } from '@/assets/Icon';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { createCoinbaseNonce, subscribeCoinbaseMessaging } from '@/utils/XMTP';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { createConsentMessage } from '@xmtp/consent-proof-signature'
import {
  isCtaInfo,
  useNotifiTargetContext,
  useNotifiFrontendClientContext
} from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import React, { useCallback, useMemo, useState } from 'react';

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
  const { wallets, selectedWallet } = useWallets();
  const { popGlobalInfoModal } = useGlobalStateContext();

  const signWallet = async () => {
    if (!selectedWallet) {
      throw Error('Unable to sign the wallet. Please try again.');
    }

    const targetId = targetData?.wallet?.data?.id ?? "";
    const address =
      selectedWallet === 'coinbase'
        ? wallets[selectedWallet]?.walletKeys?.hex ?? ''
        : '';
    // TODO: get senderAddress from target
    const senderAddress = "0xb49bbE2c31CF4a0fB74b16812b8c6B6FeEE23524"
    const timestamp = Date.now();
    const message = createConsentMessage(senderAddress, timestamp)
    console.log(message)
    const signature = await wallets[selectedWallet].signArbitrary(message);

    if (!signature) {
      throw Error('Unable to sign the wallet. Please try again.');
    }

    console.log(targetId)
    console.log(address)
    await frontendClient.verifyXmtpTarget(
      {
        input: {
          web3TargetId: targetId,
          accountId: address,
          consentProofSignature: signature as string,
          timestamp: timestamp,
          isCBW: true,
        }
      });
    // await signCoinbaseSignature(address, senderAddress);
    await frontendClient.verifyCbwTarget(
      {
        input: {
          targetId: targetId
        }
      });
  }

  const signCoinbaseSignature = async (address: string, senderAddress: string) => {
    try {
      setIsLoading(true);

      const nonce = await createCoinbaseNonce();
      if (!nonce || !selectedWallet)
        throw Error('Unable to sign the wallet. Please try again.');

      const conversationTopic = ''; //TODO: retrieve it from API

      const message = `Coinbase Wallet Messaging subscribe
      Address: ${address}
      Partner Address: ${senderAddress}
      Nonce: ${nonce}`;

      const signature = await wallets[selectedWallet].signArbitrary(message);

      if (!signature)
        throw Error('Unable to sign the wallet. Please try again.');

      const payload = {
        address,
        nonce,
        signature: signature as string,
        isActivatedViaCb: true,
        partnerAddress: senderAddress,
        conversationTopic,
      };

      await subscribeCoinbaseMessaging(payload);
    } catch (e) {
      popGlobalInfoModal({
        message: 'Unable to sign the wallet. Please try again.',
        iconOrEmoji: { type: 'icon', id: 'warning' },
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
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
            className={`flex ${targetInfoPrompts.email?.infoPrompt.type === 'cta'
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

          {targetInfoPrompts.wallet?.infoPrompt.type === 'cta' ? (
            <div className="flex flex-row items-center justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">Wallet Alerts</div>
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy={targetInfoPrompts.wallet?.infoPrompt.message ?? ''}
                onClick={() => {
                  const infoPrompt = targetInfoPrompts.wallet?.infoPrompt;
                  if (
                    infoPrompt &&
                    isCtaInfo(infoPrompt) &&
                    infoPrompt.message === 'Sign Wallet' &&
                    !isLoading
                  ) {
                    signWallet();
                  }
                  else if (infoPrompt && isCtaInfo(infoPrompt))
                    infoPrompt.onClick();
                }}
                infoPromptMessage={
                  targetInfoPrompts.wallet?.infoPrompt.message ?? ''
                }
              />
            </div>
          ) : (
            <div className="flex flex-row items-start justify-between w-3/4 sm:w-90 mr-4">
              <div className="text-sm ml-6 text-notifi-text">Wallet Alerts</div>
              {targetData.wallet?.data?.isConfirmed ? VerifiedText : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
