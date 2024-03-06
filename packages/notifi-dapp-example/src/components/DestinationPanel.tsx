import { Icon } from '@/assets/Icon';
import {
  CardConfigItemV1,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
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
          <div className="bg-white rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="email-icon"
              width="15px"
              height="12px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2">Email</div>
          </div>
          <div className="flex flex-col items-start justify-between w-90 mr-4">
            <div className="text-sm ml-6">{email}</div>
            {emailErrorMessage?.type === 'recoverableError' ? (
              <DestinationInfoPrompt
                isSent={isEmailConfirmationSent}
                onClick={() => handleResendEmailVerificationClick()}
                infoPromptMessage={
                  isEmailConfirmationSent
                    ? 'Verification email sent'
                    : 'Resend verification email'
                }
              />
            ) : (
              VerifiedText
            )}
          </div>
        </div>
      ) : null}
      {contactInfo.telegram.active && telegramId ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="telegram-icon"
              width="16px"
              height="14px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2">Telegram</div>
          </div>

          {telegramErrorMessage?.type === 'recoverableError' ? (
            <div className="flex flex-row items-center justify-between w-90 mr-4">
              <div className="text-sm ml-6">{telegramId}</div>
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy="Verify ID"
                onClick={() => {
                  telegramErrorMessage?.onClick();
                }}
                infoPromptMessage={
                  telegramErrorMessage?.message ??
                  confirmationLabels?.telegram ??
                  ''
                }
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
      {/* hide until slack is ready */}
      {/* <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="slack-icon"
            width="16px"
            height="16px"
            className="text-notifi-toggle-on-bg"
          />
          <div className="font-medium text-xs mt-2">Slack</div>
        </div>
        <div className="flex flex-col items-start justify-between w-90 mr-4">
          <div className="text-sm ml-6">testSlack@gmail.com</div> */}
      {/* todo: update when implement slack flow */}
      {/* {emailErrorMessage?.type === 'recoverableError' ? (
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
          )} */}
      {/* </div>
      </div> */}
      {contactInfo?.discord?.active && useDiscord ? (
        <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
          <div className="bg-white rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
            <Icon
              id="discord-icon"
              width="17px"
              height="13px"
              className="text-notifi-toggle-on-bg"
            />
            <div className="font-medium text-xs mt-2">Discord</div>
          </div>

          {discordErrrorMessage?.type === 'recoverableError' ? (
            <div className="flex flex-row items-center justify-between w-90 mr-4">
              <div className="text-sm ml-6">Discord Bot DM Alerts</div>
              <DestinationInfoPrompt
                isButton={true}
                buttonCopy={discordErrrorMessage.message ?? ''}
                onClick={() => {
                  discordErrrorMessage?.onClick();
                }}
                infoPromptMessage={
                  discordErrrorMessage?.message ??
                  confirmationLabels?.telegram ??
                  ''
                }
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
    </div>
  );
};
