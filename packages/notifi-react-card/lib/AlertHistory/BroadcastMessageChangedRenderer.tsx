import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type BroadcastMessageChangedRendererProps = Readonly<{
  notification;
}>;

export const BroadcastMessageChangedRenderer: React.FC<
  BroadcastMessageChangedRendererProps
> = ({ notification }) => {
  return (
    <AlertNotificationRow
      notificationSubject={notification.subject}
      notificationDate={notification.createdDate}
      notificationMessage={notification.message}
    />
  );
};
