import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type GenericEventRendererProps = Readonly<{
  sourceName: string;
  genericMessage: string;
  createdDate: string;
}>;

export const GenericEventRenderer: React.FC<GenericEventRendererProps> = ({
  sourceName,
  genericMessage,
  createdDate,
}) => {
  const getTitle = () => {
    return `New message from ${sourceName}`;
  };

  const getMessage = () => {
    return genericMessage;
  };
  return (
    <AlertNotificationRow
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
