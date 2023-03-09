import React from 'react';

import { AlertIcon } from './AlertIcon';
import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

type GenericDetailRendererProps = Readonly<{
  createdDate: string;
  message: string | undefined;
  subject: string | undefined;
  notificationTitle: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
  icon: string;
}>;

export const GenericDetailRenderer: React.FC<GenericDetailRendererProps> = ({
  message,
  subject,
  createdDate,
  notificationTitle,
  handleAlertEntrySelection,
  classNames,
  icon,
}) => {
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={<AlertIcon icon={icon} />}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
      classNames={classNames}
    />
  );
};
