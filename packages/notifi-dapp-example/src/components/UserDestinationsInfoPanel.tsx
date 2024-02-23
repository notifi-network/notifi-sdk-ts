import { Icon } from '@/assets/Icon';
import {
  CardConfigItemV1,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
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
    <div className="font-semibold text-sm text-notifi-success ml-6">
      Verified
    </div>
  );

  return (
    <div>
      {contactInfo.email.active && email ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="email-icon"
              width="15px"
              height="12px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-bold text-xs mt-2">Email</div>
          </div>
          <div className="flex flex-col items-start justify-between w-90 mr-4">
            <div className="font-semibold text-sm ml-6">{email}</div>
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
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="slack-icon"
            width="16px"
            height="16px"
            className="text-notifi-toggle-on-bg"
          />
          <div className="font-bold text-xs mt-2">Slack</div>
        </div>
        <div className="flex flex-col items-start justify-between w-90 mr-4">
          <div className="font-semibold text-sm ml-6">testSlack@gmail.com</div>
          {/* todo: update when implement slack flow */}
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
          <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="discord-icon"
              width="17px"
              height="13px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-bold text-xs mt-2">Discord</div>
          </div>

          {discordErrrorMessage?.type === 'recoverableError' ? (
            <div className="flex flex-row items-center justify-between w-90 mr-4">
              <div className="font-semibold text-sm ml-6">
                Discord Bot DM Alerts
              </div>
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
              <div className="font-semibold text-sm ml-6">
                {discordTargetData?.isConfirmed === true
                  ? discordUserName
                  : 'Discord'}
              </div>
              {VerifiedText}
            </div>
          )}
        </div>
      ) : null}
      {contactInfo.telegram.active && telegramId ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="telegram-icon"
              width="16px"
              height="14px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-bold text-xs mt-2">Telegram</div>
          </div>

          {telegramErrorMessage?.type === 'recoverableError' ? (
            <div className="flex flex-row items-center justify-between w-90 mr-4">
              <div className="font-semibold text-sm ml-6">Telegram Alerts</div>
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
              <div className="font-semibold text-sm ml-6">{telegramId}</div>
              {VerifiedText}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
