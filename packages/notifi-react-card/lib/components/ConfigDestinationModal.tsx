import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

import { DiscordIcon } from '../assets/DiscordIcon';
import { EmailIcon } from '../assets/EmailIcon';
import { SmsIcon } from '../assets/SmsIcon';
import { TelegramIcon } from '../assets/TelegramIcon';
import { useNotifiSubscriptionContext } from '../context';
import { FtuConfigStep } from './subscription';
import { DestinationErrorMessage } from './subscription/subscription-card-views/preview-panel/DestinationErrorMessage';

export type ConfigDestinationModalProps = Readonly<{
  classNames?: {
    container?: string;
    overlay?: string;
    headerContainer?: string;
    headerTitle?: string;
    footerContainer?: string;
    emailContainer?: string;
    emailLabel?: string;
    emailLabelIcon?: string;
    emailHelpPhrase?: string;
    emailAddress?: string;
    emailResendLink?: string;
    smsContainer?: string;
    smsLabel?: string;
    smsLabelIcon?: string;
    phoneNumber?: string;
    telegramContainer?: string;
    telegramLabel?: string;
    telegramLabelIcon?: string;
    telegramId?: string;
    discordContainer?: string;
    discordLabel?: string;
    discordLabelIcon?: string;
    verifiedButton?: string;
    verifyButtonMessage?: string;
    verifyButtonContainer?: string;
  };
  setFtuConfigStep: (step: FtuConfigStep) => void;
  contactInfo: CardConfigItemV1['contactInfo'];
}>;

export const ConfigDestinationModal: React.FC<ConfigDestinationModalProps> = ({
  classNames,
  setFtuConfigStep,
  contactInfo,
}) => {
  const {
    destinationErrorMessages,
    email,
    phoneNumber,
    telegramId,
    useDiscord,
  } = useNotifiSubscriptionContext();

  const [isEmailConfirmationSent, setIsEmailConfirmationSent] =
    useState<boolean>(false);

  const {
    telegram: telegramErrorMessage,
    email: emailErrorMessage,
    phoneNumber: phoneNumberErrorMessage,
    discord: discordErrrorMessage,
  } = destinationErrorMessages;

  const handleResendEmailVerificationClick = useCallback(() => {
    if (emailErrorMessage?.type !== 'recoverableError') return;
    setIsEmailConfirmationSent(true);
    emailErrorMessage.onClick();
    setTimeout(() => {
      setIsEmailConfirmationSent(false);
    }, 3000);
  }, [emailErrorMessage]);

  return (
    <>
      <div
        className={clsx('configDestinationModal__overlay', classNames?.overlay)}
      ></div>
      <div
        className={clsx(
          'configDestinationModal__container',
          classNames?.container,
        )}
      >
        <div
          className={clsx(
            'configDestinationModal__headerContainer',
            classNames?.headerContainer,
          )}
        >
          <div
            className={clsx(
              'configDestinationModal__headerTitle',
              classNames?.headerTitle,
            )}
          >
            <div>Verify your destinations</div>
          </div>
        </div>
        <div
          className={clsx(
            'configDestinationModal__destinationsContainer',
            classNames?.container,
          )}
        >
          {contactInfo.email.active && email ? (
            <div
              className={clsx(
                'configDestinationModal__email',
                classNames?.emailContainer,
              )}
            >
              <div
                className={clsx(
                  'configDestinationModal__emailLabel',
                  classNames?.emailLabel,
                )}
              >
                <div
                  className={clsx(
                    'configDestinationModal__emailLabelIcon',
                    classNames?.emailLabelIcon,
                  )}
                >
                  <EmailIcon />
                </div>
                <div>Email</div>
              </div>
              {emailErrorMessage?.type === 'recoverableError' ? (
                <>
                  <div
                    className={clsx(
                      'configDestinationModal__emailHelpPhrase',
                      classNames?.emailHelpPhrase,
                    )}
                  >
                    We’ve sent a verification email to:
                  </div>
                  <div
                    className={clsx(
                      'configDestinationModal__emailAddress',
                      classNames?.emailAddress,
                    )}
                  >
                    {email}
                  </div>
                  <DestinationErrorMessage
                    classNames={{
                      errorMessage: clsx(
                        'configDestinationModal__emailResendLink',
                        classNames?.emailResendLink,
                      ),
                    }}
                    onClick={() => {
                      handleResendEmailVerificationClick();
                    }}
                    errorMessage={
                      isEmailConfirmationSent
                        ? 'Sent'
                        : emailErrorMessage.message
                    }
                    tooltipContent={emailErrorMessage?.tooltip}
                  />
                </>
              ) : (
                <VerifiedButton className={classNames?.verifiedButton} />
              )}
            </div>
          ) : null}
          {contactInfo.sms.active && phoneNumber ? (
            <div
              className={clsx(
                'configDestinationModal__sms',
                classNames?.smsContainer,
              )}
            >
              <div
                className={clsx(
                  'configDestination__smsLabel',
                  classNames?.smsLabel,
                )}
              >
                <div
                  className={clsx(
                    'configDestination__smsLabelIcon',
                    classNames?.smsLabelIcon,
                  )}
                >
                  <SmsIcon />
                </div>
                <div
                  className={clsx(
                    'configDestinationModal__phoneNumber',
                    classNames?.phoneNumber,
                  )}
                >
                  Phone Number
                </div>
              </div>
              <div>{phoneNumber}</div>
              {phoneNumberErrorMessage?.type !== undefined ? (
                <DestinationErrorMessage
                  errorMessage={phoneNumberErrorMessage?.message}
                  tooltipContent={phoneNumberErrorMessage?.tooltip}
                />
              ) : (
                <VerifiedButton className={classNames?.verifiedButton} />
              )}
            </div>
          ) : null}
          {contactInfo.telegram.active && telegramId ? (
            <div
              className={clsx(
                'configDestinationModal__telegram',
                classNames?.telegramContainer,
              )}
            >
              <div
                className={clsx(
                  'configDestinationModal__telegramLabel',
                  classNames?.telegramLabel,
                )}
              >
                <div
                  className={clsx(
                    'configDestinationModal__telegramLabelIcon',
                    classNames?.telegramLabelIcon,
                  )}
                >
                  <TelegramIcon />
                </div>

                <div>Telegram</div>
              </div>

              {telegramErrorMessage?.type === 'recoverableError' ? (
                <>
                  <div
                    className={clsx(
                      'configDestinationModal__telegramId',
                      classNames?.telegramId,
                    )}
                  >
                    {telegramId}
                  </div>
                  <DestinationErrorMessage
                    classNames={{
                      errorMessage: clsx(
                        'configDestinationModal__verifyButtonMessage',
                        classNames?.verifyButtonMessage,
                      ),
                      errorMessageContainer: clsx(
                        'configDestinationModal__verifyButtonContainer',
                        classNames?.verifyButtonContainer,
                      ),
                    }}
                    onClick={() => {
                      telegramErrorMessage?.onClick();
                    }}
                    errorMessage={telegramErrorMessage?.message ?? ''}
                    tooltipContent={destinationErrorMessages?.telegram?.tooltip}
                  />
                </>
              ) : (
                <VerifiedButton className={classNames?.verifiedButton} />
              )}
            </div>
          ) : null}
          {contactInfo?.discord?.active && useDiscord ? (
            <div
              className={clsx(
                'configDestinationModal__discord',
                classNames?.discordContainer,
              )}
            >
              <label
                className={clsx(
                  'configDestinationModal__discordLabel',
                  classNames?.discordLabel,
                )}
              >
                <div
                  className={clsx(
                    'configDestinationModal__discordLabelIcon',
                    classNames?.discordLabelIcon,
                  )}
                >
                  <DiscordIcon />
                </div>

                <div>Discord</div>
              </label>
              {discordErrrorMessage?.type === 'recoverableError' ? (
                <>
                  <DestinationErrorMessage
                    classNames={{
                      errorMessage: clsx(
                        'configDestinationModal__verifyButtonMessage',
                        classNames?.verifyButtonMessage,
                      ),
                      errorMessageContainer: clsx(
                        'configDestinationModal__verifyButtonContainer',
                        classNames?.verifyButtonContainer,
                      ),
                    }}
                    onClick={() => {
                      discordErrrorMessage?.onClick();
                    }}
                    errorMessage={discordErrrorMessage?.message ?? ''}
                    tooltipContent={destinationErrorMessages?.discord?.tooltip}
                  />
                </>
              ) : (
                <VerifiedButton className={classNames?.verifiedButton} />
              )}
            </div>
          ) : null}
        </div>
        <div
          className={clsx(
            'configDestinationModal__footerContainer',
            classNames?.footerContainer,
          )}
        >
          <button onClick={() => setFtuConfigStep(FtuConfigStep.Alert)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

type VerifiedButtonProps = Readonly<{
  className?: string;
}>;
const VerifiedButton: React.FC<VerifiedButtonProps> = ({ className }) => {
  return (
    <div className={clsx('configDestinationModal__verifiedButton', className)}>
      <div>Verified</div>
    </div>
  );
};
