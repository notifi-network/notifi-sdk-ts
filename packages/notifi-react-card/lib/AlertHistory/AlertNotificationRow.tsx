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
  notificationImage,
  notificationSubject,
  notificationDate,
  notificationMessage,
}) => {
  return (
    <div className={'NotifiAlertHistory_notificationRow'}>
      <div
        className={clsx(
          'NotifiAlertHistory__notificationImage',
          classNames?.notificationImage,
        )}
      >
        {notificationImage}
      </div>
      <div className={'NotifiAlertHistory_content'}>
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
        {notificationDate}
      </div>
    </div>
  );
};
