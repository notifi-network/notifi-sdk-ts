import React from 'react';

import { AlertNotificationRow } from './AlertNotificationRow';

export type NftAuctionChangedRendererProps = Readonly<{
  auctionDetails: string;
  auctionTitle: string;
  createdDate: string;
  newBidValue: number;
  newBidSymbol: string;
}>;

export const NftAuctionChangedRenderer: React.FC<
  NftAuctionChangedRendererProps
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
