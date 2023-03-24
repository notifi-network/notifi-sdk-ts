import clsx from 'clsx';
import { PenIcon } from 'notifi-react-card/lib/assets/PenIcon';
import React, { useCallback, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../../../hooks';
import { DeepPartialReadonly } from '../../../../utils';

export type UserInfoSection = {
  container: string;
  label: string;
  confirmationLink: string;
  confirmationLabel: string;
  errorMessage: string;
};

export type UserInfoPanelProps = {
  classNames?: DeepPartialReadonly<{
    alertHistory: string;
    container: string;
    email?: UserInfoSection;
    telegram?: UserInfoSection;
    sms?: UserInfoSection;
    EditButton: string;
    myWallet?: UserInfoSection;
  }>;
  contactInfo: CardConfigItemV1['contactInfo'];
  confirmationLabels?: {
    email?: string;
    telegram?: string;
  };
};
export const UserInfoPanel: React.FC<UserInfoPanelProps> = ({
  classNames,
  contactInfo,
  confirmationLabels,
}) => {
  const [isEmailConfirmationSent, setIsEmailConfirmationSent] =
    useState<boolean>(false);

  const {
    phoneNumber,
    email,
    telegramId,
    setCardView,
    emailIdThatNeedsConfirmation,
    telegramConfirmationUrl,
    destinationErrorMessages,
  } = useNotifiSubscriptionContext();

  const {
    params: { multiWallet },
  } = useNotifiClientContext();

  const { resendEmailVerificationLink } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const handleEditClick = useCallback(() => {
    setCardView({ state: 'edit' });
  }, [setCardView, phoneNumber, email, telegramId]);

  const handleResendEmailVerificationClick = useCallback(() => {
    setIsEmailConfirmationSent(true);
    resendEmailVerificationLink();
    setTimeout(() => setIsEmailConfirmationSent(false), 3000);
  }, []);

  return (
    <div
      className={clsx('NotifiUserInfoPanelContainer', classNames?.container)}
    >
      {contactInfo.email.active && email ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__email',
            classNames?.email?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__emailLabel',
              classNames?.email?.label,
            )}
          >
            {email}
          </label>
          {emailIdThatNeedsConfirmation !== '' ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleResendEmailVerificationClick}
              className={clsx(
                'NotifiUserInfoPanel__emailConfirmation',
                classNames?.email?.confirmationLink,
              )}
            >
              <label
                className={clsx(
                  'NotifiUserInfoPanel__emailConfirmationLabel',
                  classNames?.email?.confirmationLabel,
                  {
                    NotifiUserInfoPanel__emailConfirmationSent:
                      isEmailConfirmationSent,
                  },
                )}
              >
                {confirmationLabels?.email ?? isEmailConfirmationSent
                  ? 'Email sent!'
                  : 'Resend Link'}
              </label>
            </a>
          ) : null}
        </div>
      ) : null}
      {contactInfo.sms.active && phoneNumber ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__sms',
            classNames?.sms?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__smsLabel',
              classNames?.sms?.label,
            )}
          >
            {phoneNumber}
          </label>
          {destinationErrorMessages.phoneNumber !== '' ? (
            <label
              className={clsx(
                'NotifiUserInfoPanel__smsErrorMessageLabel',
                classNames?.sms?.errorMessage,
                {
                  NotifiUserInfoPanel__smsErrorMessage:
                    destinationErrorMessages.phoneNumber !== '',
                },
              )}
            >
              {destinationErrorMessages.phoneNumber}
            </label>
          ) : null}
        </div>
      ) : null}
      {contactInfo.telegram.active && telegramId ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__telegram',
            classNames?.telegram?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__telegramLabel',
              classNames?.telegram?.label,
            )}
          >
            {telegramId}
          </label>
          {telegramConfirmationUrl ? (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={telegramConfirmationUrl}
              className={clsx(
                'NotifiUserInfoPanel__telegramConfirmation',
                classNames?.telegram?.confirmationLink,
              )}
            >
              <label
                className={clsx(
                  'NotifiUserInfoPanel__telegramConfirmationLabel',
                  classNames?.telegram?.confirmationLabel,
                )}
              >
                {confirmationLabels?.telegram ?? 'Verify Id'}
              </label>
            </a>
          ) : null}
        </div>
      ) : null}
      {multiWallet !== undefined && multiWallet.ownedWallets.length > 0 ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__myWallet',
            classNames?.myWallet?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__myWalletLabel',
              classNames?.myWallet?.label,
            )}
          >
            My wallets
          </label>
          <button
            className={clsx(
              'NotifiUserInfoPanel__myWalletConfirmation',
              classNames?.myWallet?.confirmationLink,
            )}
            onClick={() => {
              setCardView({ state: 'verify' });
            }}
          >
            Edit
          </button>
        </div>
      ) : null}
      <button
        className={clsx(
          'NotifiPreviewCard__editButton',
          classNames?.EditButton,
        )}
        onClick={handleEditClick}
      >
        <PenIcon />
        Edit
      </button>
    </div>
  );
};
