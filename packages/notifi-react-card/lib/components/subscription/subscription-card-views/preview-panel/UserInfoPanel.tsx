import clsx from 'clsx';
import React, { useCallback } from 'react';

import { useNotifiSubscriptionContext } from '../../../../context';
import { CardConfigItemV1 } from '../../../../hooks';
import { DeepPartialReadonly } from '../../../../utils';

export type UserInfoSection = {
  container: string;
  label: string;
};

export type UserInfoPanelProps = {
  classNames?: DeepPartialReadonly<{
    container: string;
    email?: UserInfoSection;
    telegram?: UserInfoSection;
    sms?: UserInfoSection;
    EditButton: string;
  }>;
  data: CardConfigItemV1;
};
export const UserInfoPanel: React.FC<UserInfoPanelProps> = ({
  classNames,
  data,
}) => {
  const { phoneNumber, email, telegramId, setCardView } =
    useNotifiSubscriptionContext();

  const handleEditClick = useCallback(() => {
    setCardView({ state: 'edit' });
  }, [setCardView, phoneNumber, email, telegramId]);

  return (
    <div
      className={clsx('NotifiUserInfoPanelContainer', classNames?.container)}
    >
      {data.contactInfo.email.active ? (
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
        </div>
      ) : null}
      {data.contactInfo.sms.active ? (
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
      {data.contactInfo.telegram.active ? (
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
    </div>
  );
};
