import { Icon } from '@/assets/Icon';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  isCtaInfo,
  useNotifiTargetContext,
} from '@notifi-network/notifi-react';
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
              <div className="text-sm ml-6">{targetData.telegram}</div>
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
    </div>
  );
};
