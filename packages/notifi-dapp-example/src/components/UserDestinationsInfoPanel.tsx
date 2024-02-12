import {
  CardConfigItemV1,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';

import { DestinationErrorMessage } from './DestinationErrorMessage';

export type UserInfoSection = {
  container: string;
  label: string;
  confirmationLink: string;
  confirmationLabel: string;
  errorMessageContainer: string;
  errorMessage: string;
  tooltipContent: string;
};

export type UserDestinationsInfoPanelProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  confirmationLabels?: {
    email?: string;
    telegram?: string;
  };
};
export const UserDestinationsInfoPanel: React.FC<
  UserDestinationsInfoPanelProps
> = ({ contactInfo, confirmationLabels }) => {
  const [isEmailConfirmationSent, setIsEmailConfirmationSent] =
    useState<boolean>(false);

  const {
    email,
    telegramId,
    destinationErrorMessages,
    useDiscord,
    discordTargetData,
  } = useNotifiSubscriptionContext();

  const {
    telegram: telegramErrorMessage,
    email: emailErrorMessage,
    discord: discordErrrorMessage,
  } = destinationErrorMessages;

  const handleResendEmailVerificationClick = useCallback(() => {
    if (emailErrorMessage?.type !== 'recoverableError') return;
    setIsEmailConfirmationSent(true);
    emailErrorMessage.onClick();
    setTimeout(() => setIsEmailConfirmationSent(false), 3000);
  }, [emailErrorMessage]);

  const discordUserName = useMemo(() => {
    const { username, discriminator } = discordTargetData || {};

    return discriminator === '0' ? username : `${username}#${discriminator}`;
  }, [discordTargetData]);

  const VerifiedText = (
    <text className="font-semibold text-sm text-notifi-success ml-6">
      Verified
    </text>
  );

  return (
    <div>
      {contactInfo.email.active && email ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-dusk flex flex-col items-center justify-center">
            <Image
              src="/logos/email-icon.svg"
              alt="email-icon"
              width={15}
              height={12}
            />
            <text className="font-bold text-xs mt-2">Email</text>
          </div>
          <div className="flex flex-col items-start justify-between w-90 mr-4">
            <text className="font-semibold text-sm ml-6">
              testEmail@gmail.com
            </text>
            {emailErrorMessage?.type === 'recoverableError' ? (
              <DestinationErrorMessage
                onClick={() => handleResendEmailVerificationClick()}
                errorMessage={'Resend verification email'}
                tooltipContent={emailErrorMessage?.tooltip}
              />
            ) : (
              VerifiedText
            )}
          </div>
        </div>
      ) : null}
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-dusk flex flex-col items-center justify-center">
          <Image
            src="/logos/slack-icon.svg"
            alt="slack-icon"
            width={16}
            height={16}
          />
          <text className="font-bold text-xs mt-2">Slack</text>
        </div>
        <div className="flex flex-col items-start justify-between w-90 mr-4">
          <text className="font-semibold text-sm ml-6">
            testSlack@gmail.com
          </text>
          {emailErrorMessage?.type === 'recoverableError' ? (
            <DestinationErrorMessage
              onClick={() => handleResendEmailVerificationClick()}
              errorMessage={
                isEmailConfirmationSent
                  ? 'Resend verification email'
                  : emailErrorMessage.message
              }
              tooltipContent={emailErrorMessage?.tooltip}
            />
          ) : (
            VerifiedText
          )}
        </div>
      </div>
      {contactInfo?.discord?.active && useDiscord ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-dusk flex flex-col items-center justify-center">
            <Image
              src="/logos/discord-icon.svg"
              alt="discord-icon"
              width={17}
              height={13}
            />
            <text className="font-bold text-xs mt-2">Discord</text>
          </div>

          {discordErrrorMessage?.type === 'recoverableError' ? (
            <div className="flex flex-row items-center justify-between w-90 mr-4">
              <text className="font-semibold text-sm ml-6">
                Discord Bot DM Alerts
              </text>
              <DestinationErrorMessage
                isButton={true}
                buttonCopy="Enable Bot"
                onClick={() => {
                  discordErrrorMessage?.onClick();
                }}
                errorMessage={
                  discordErrrorMessage?.message ??
                  confirmationLabels?.telegram ??
                  ''
                }
                tooltipContent={destinationErrorMessages?.discord?.tooltip}
              />
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between w-90 mr-4">
              <text className="font-semibold text-sm ml-6">
                Discord Bot DM Alerts
              </text>
              {VerifiedText}
            </div>
          )}
        </div>
      ) : null}
      {contactInfo.telegram.active && telegramId ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-dusk flex flex-col items-center justify-center">
            <Image
              src="/logos/telegram-icon.svg"
              alt="telegran-icon"
              width={16}
              height={16}
            />
            <text className="font-bold text-xs mt-2">Telegram</text>
          </div>

          {telegramErrorMessage?.type === 'recoverableError' ? (
            <div className="flex flex-row items-center justify-between w-90 mr-4">
              <text className="font-semibold text-sm ml-6">
                Telegram Alerts
              </text>
              <DestinationErrorMessage
                isButton={true}
                buttonCopy="Verify ID"
                onClick={() => {
                  telegramErrorMessage?.onClick();
                }}
                errorMessage={
                  telegramErrorMessage?.message ??
                  confirmationLabels?.telegram ??
                  ''
                }
                tooltipContent={destinationErrorMessages?.telegram?.tooltip}
              />
            </div>
          ) : (
            <div className="flex flex-col items-start justify-between w-90 mr-4">
              <text className="font-semibold text-sm ml-6">
                Telegram Alerts
              </text>
              {VerifiedText}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
