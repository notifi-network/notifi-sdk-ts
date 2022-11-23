import clsx from 'clsx';
import React from 'react';

import { formatTimestamp } from '../.././utils/AlertHistoryUtils';

export type AlertNotificationViewProps = Readonly<{
  notificationTitle: string | undefined;
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
    notificationTitle?: string;
  }>;
  handleAlertEntrySelection?: () => void;
}>;

export const AlertNotificationRow: React.FC<AlertNotificationViewProps> = ({
  notificationTitle,
  classNames,
  notificationImage,
  notificationSubject,
  notificationDate,
  // notificationMessage,
  handleAlertEntrySelection,
}) => {
  return (
    <div
      className={clsx(
        'NotifiAlertHistory__notificationRow',
        classNames?.notificationRow,
      )}
      onClick={handleAlertEntrySelection}
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
            'NotifiAlertHistory__notificationTitle',
            classNames?.notificationTitle,
          )}
        >
          {notificationTitle}
        </div>
        <div
          className={clsx(
            'NotifiAlertHistory__notificationSubject',
            classNames?.notificationSubject,
          )}
        >
          {notificationSubject}
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
