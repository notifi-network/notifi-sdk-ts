import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type ChatMessageReceivedRendererProps = Readonly<{
  senderName: string;
  messageBody: string;
  createdDate: string;
}>;

export const NftCollectionReportRenderer: React.FC<
  ChatMessageReceivedRendererProps
> = ({ senderName, messageBody, createdDate }) => {
  const getTitle = () => {
    return `New Message from ${senderName}`;
  };

  const getMessage = () => {
    return messageBody;
  };
  return (
    <AlertNotificationRow
      notificationTitle={getTitle()}
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
