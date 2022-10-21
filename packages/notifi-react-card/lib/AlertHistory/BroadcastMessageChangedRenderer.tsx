import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

type BroadcastMessageChangedRendererProps = Readonly<{
  createdDate: string;
  message: string;
  subject: string;
}>;

export const BroadcastMessageChangedRenderer: React.FC<
  BroadcastMessageChangedRendererProps
> = ({ message, subject, createdDate }) => {
  return (
    <AlertNotificationRow
      notificationSubject={subject}
      notificationDate={createdDate}
      notificationMessage={message}
    />
  );
};
