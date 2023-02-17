import React from 'react';

import { AnnouncementIcon } from '../../assets/AnnouncementIcon';
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
}>;

export const GenericDetailRenderer: React.FC<GenericDetailRendererProps> = ({
  message,
  subject,
  createdDate,
  notificationTitle,
  handleAlertEntrySelection,
  classNames,
}) => {
  return (
    <AlertNotificationRow
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={notificationTitle}
      notificationImage={<AnnouncementIcon />}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
      classNames={classNames}
    />
  );
};
