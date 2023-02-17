import React from 'react';

import { ChatAlertIcon } from '../../assets/ChatAlertIcon';
import {
  AlertNotificationRow,
  AlertNotificationViewProps,
} from './AlertNotificationRow';

export type ChatMessageReceivedRendererProps = Readonly<{
  senderName: string;
  messageBody: string;
  createdDate: string;
  handleAlertEntrySelection: () => void;
  classNames?: AlertNotificationViewProps['classNames'];
}>;

export const ChatMessageReceivedRenderer: React.FC<
  ChatMessageReceivedRendererProps
> = ({
  senderName,
  messageBody,
  createdDate,
  handleAlertEntrySelection,
  classNames,
}) => {
  const getTitle = () => {
    return `New Message from ${senderName}`;
  };

  const getMessage = () => {
    return messageBody;
  };
  return (
    <AlertNotificationRow
      classNames={classNames}
      handleAlertEntrySelection={handleAlertEntrySelection}
      notificationTitle={getTitle()}
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
      notificationImage={<ChatAlertIcon width={17} height={17} />}
    />
  );
};
