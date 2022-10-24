import clsx from 'clsx';
import React from 'react';

import { formatTimestamp } from '../.././utils/AlertHistoryUtils';

export type AlertNotificationViewProps = Readonly<{
  notificationImage?: JSX.Element;
  notificationSubject: string | undefined;
  notificationDate: string;
  notificationMessage: string | undefined;
  classNames?: Readonly<{
    notificationContent?: string;
    notificationDate?: string;
    notificationImage?: string;
    notificationMessage?: string;
    notificationRow?: string;
    notificationSubject?: string;
  }>;
}>;

export const AlertNotificationRow: React.FC<AlertNotificationViewProps> = ({
  classNames,
  notificationImage,
  notificationSubject,
  notificationDate,
  notificationMessage,
}) => {
  return (
    <div
      className={clsx(
        'NotifiAlertHistory__notificationRow',
        classNames?.notificationRow,
      )}
    >
      <div
        className={clsx(
          'NotifiAlertHistory__notificationImage',
          classNames?.notificationImage,
        )}
      >
        {notificationImage}
      </div>
      <div
        className={clsx(
          'NotifiAlertHistory__content',
          classNames?.notificationContent,
        )}
      >
        <div
          className={clsx(
            'NotifiAlertHistory__notificationSubject',
            classNames?.notificationSubject,
          )}
        >
          {notificationSubject}
        </div>
        <div
          className={clsx(
            'NotifiAlertHistory__notificationMessage',
            classNames?.notificationMessage,
          )}
        >
          {notificationMessage}
        </div>
      </div>
      <div
        className={clsx(
          'NotifiAlertHistory__notificationDate',
          classNames?.notificationDate,
        )}
      >
        {formatTimestamp(notificationDate)}
      </div>
    </div>
  );
};
