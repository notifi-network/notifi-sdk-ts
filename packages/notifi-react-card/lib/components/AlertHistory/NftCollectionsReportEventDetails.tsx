import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type NftCollectionReportRendererProps = Readonly<{
  createdDate: string;
  providerName: string;
  collections: {
    signal: string;
    volume1Day: number;
  };
}>;

export const NftCollectionReportRenderer: React.FC<
  NftCollectionReportRendererProps
> = ({ createdDate, collections, providerName }) => {
  const getTitle = () => {
    return `${providerName} Signal`;
  };

  const getMessage = () => {
    return `Collection ${collections.signal} has a 1-day volume of ${collections.volume1Day}`;
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
