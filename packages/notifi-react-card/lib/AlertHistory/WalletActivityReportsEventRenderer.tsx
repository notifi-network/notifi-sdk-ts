import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type WalletsActivityReportEventRendererProps = Readonly<{
  auctionDetails: string;
  auctionTitle: string;
  createdDate: string;
  newBidValue: number;
  newBidSymbol: string;
}>;

export const WalletsActivityReportEventRenderer: React.FC<
  WalletsActivityReportEventRendererProps
> = ({
  auctionTitle,
  auctionDetails,
  createdDate,
  newBidValue,
  newBidSymbol,
}) => {
  const getTitle = () => {
    return auctionTitle;
  };

  const getMessage = () => {
    return `New bid with value ${newBidValue} ${newBidSymbol} placed on auction ${auctionDetails}`;
  };
  return (
    <AlertNotificationRow
      notificationSubject={getTitle()}
      notificationDate={createdDate}
      notificationMessage={getMessage()}
    />
  );
};
