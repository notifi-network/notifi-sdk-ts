import clsx from 'clsx';
import React from 'react';

export type AlertNotificationViewProps = Readonly<{
  notificationImage?: string;
  notificationSubject: string;
  notificationDate: string;
  notificationMessage: string;
  classNames?: Readonly<{
    notificationDate?: string;
    notificationSubject?: string;
    notificationMessage?: string;
    notificationImage?: string;
  }>;
}>;

export const AlertNotificationRow: React.FC<AlertNotificationViewProps> = ({
  classNames,
}) => {
  return (
    <div>
      <span
        className={clsx(
          'NotifiAlertHistory__notificationImage',
          classNames?.notificationImage,
        )}
      ></span>
      <span
        className={clsx(
          'NotifiAlertHistory__notificationDate',
          classNames?.notificationDate,
        )}
      ></span>
      <span
        className={clsx(
          'NotifiAlertHistory__notificationSubject',
          classNames?.notificationSubject,
        )}
      ></span>
      <span
        className={clsx(
          'NotifiAlertHistory__notificationMessage',
          classNames?.notificationMessage,
        )}
      ></span>
    </div>
  );
};
