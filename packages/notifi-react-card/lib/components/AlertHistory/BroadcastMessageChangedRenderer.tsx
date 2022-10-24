import React from 'react';

import { AnnouncementIcon } from '../../assets/AnnouncementIcon';
import { AlertNotificationRow } from './AlertNotificationRow';

type BroadcastMessageChangedRendererProps = Readonly<{
  createdDate: string;
  message: string | undefined;
  subject: string | undefined;
}>;

export const getDefaultIcon = () => {
  return <AnnouncementIcon />;
};

export const BroadcastMessageChangedRenderer: React.FC<
  BroadcastMessageChangedRendererProps
> = ({ message, subject, createdDate }) => {
  return (
    <AlertNotificationRow
      notificationImage={getDefaultIcon()}
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
    />
  );
};
