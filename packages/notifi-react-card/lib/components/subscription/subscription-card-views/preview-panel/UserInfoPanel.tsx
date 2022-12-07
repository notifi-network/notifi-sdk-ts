import clsx from 'clsx';
import React, { useCallback } from 'react';

import { useNotifiSubscriptionContext } from '../../../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../../../hooks';
import { DeepPartialReadonly } from '../../../../utils';

export type UserInfoSection = {
  container: string;
  label: string;
  confirmationLink: string;
  confirmationLabel: string;
};

export type UserInfoPanelProps = {
  classNames?: DeepPartialReadonly<{
    alertHistory: string;
    container: string;
    discord?: UserInfoSection;
    twitter?: UserInfoSection;
    email?: UserInfoSection;
    telegram?: UserInfoSection;
    sms?: UserInfoSection;
    EditButton: string;
  }>;
  contactInfo: CardConfigItemV1['contactInfo'];
  hideEditButton?: boolean;
  confirmationLabels?: {
    email?: string;
    telegram?: string;
  };
};
export const UserInfoPanel: React.FC<UserInfoPanelProps> = ({
  classNames,
  contactInfo,
  confirmationLabels,
  hideEditButton,
}) => {
  const {
    phoneNumber,
    email,
    telegramId,
    discordId,
    twitterId,
    setCardView,
    emailIdThatNeedsConfirmation,
    telegramConfirmationUrl,
  } = useNotifiSubscriptionContext();

  const { resendEmailVerificationLink } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const handleEditClick = useCallback(() => {
    setCardView({ state: 'edit' });
  }, [setCardView, phoneNumber, email, telegramId]);

  const handleResendEmailVerificationClick = useCallback(() => {
    resendEmailVerificationLink();
  }, []);

  return (
    <div
      className={clsx('NotifiUserInfoPanelContainer', classNames?.container)}
    >
      {contactInfo.email.active ? (
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
            {email ?? 'email'}
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
                )}
              >
                {confirmationLabels?.email ?? 'Resend Link'}
              </label>
            </a>
          ) : null}
        </div>
      ) : null}
      {contactInfo.sms.active ? (
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
            {phoneNumber ?? 'sms'}
          </label>
        </div>
      ) : null}
      {contactInfo.telegram.active ? (
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
            {telegramId ?? 'telegram'}
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
<<<<<<< HEAD
      {contactInfo.discord?.active ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__discord',
            classNames?.discord?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__discordLabel',
              classNames?.discord?.label,
            )}
          >
            {discordId ?? 'discord'}
          </label>
        </div>
      ) : null}
      {contactInfo.twitter?.active ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__twitter',
            classNames?.twitter?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__twitterLabel',
              classNames?.twitter?.label,
            )}
          >
            {twitterId ?? 'twitter'}
          </label>
        </div>
      ) : null}
      <button
        className={clsx(
          'NotifiPreviewCard__editButton',
          classNames?.EditButton,
        )}
        onClick={handleEditClick}
      >
        Edit
      </button>
=======
      {hideEditButton ? null : (
        <button
          className={clsx(
            'NotifiPreviewCard__editButton',
            classNames?.EditButton,
          )}
          onClick={handleEditClick}
        >
          Edit
        </button>
      )}
>>>>>>> c217e35 (adds field to hide edit button)
    </div>
  );
};
