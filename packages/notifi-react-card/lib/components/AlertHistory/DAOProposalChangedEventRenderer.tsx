import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type DAOProposalChangedEventRendererProps = Readonly<{
  proposalTitle: string;
  description: string;
  createdDate: string;
}>;

export const DAOProposalChangedEventRenderer: React.FC<
  DAOProposalChangedEventRendererProps
> = ({ proposalTitle, description, createdDate }) => {
  const getMessage = () => {
    return description;
  };
  return (
    <AlertNotificationRow
      notificationTitle={proposalTitle}
      notificationSubject={proposalTitle}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
