import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import { getAlertDetailsContents } from 'notifi-react-card/lib/utils';
import React, { useMemo } from 'react';

import { formatAlertDetailsTimestamp } from '../../utils/AlertHistoryUtils';

export type AlertDetailsProps = Readonly<{
  notificationEntry: Types.NotificationHistoryEntryFragmentFragment;
  classNames?: Readonly<{
    detailsContainer?: string;
    BackArrowIcon?: string;
  }>;
}>;
export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  classNames,
}) => {
  const detailsContents = useMemo(
    () => getAlertDetailsContents(notificationEntry),
    [notificationEntry],
  );
  return (
    <div
      className={clsx(
        'NotifiAlertDetails__container',
        classNames?.detailsContainer,
      )}
    >
      <div className={clsx('NotifiAlertDetails__topContentContainer')}>
        <div className={clsx('NotifiAlertDetails__topContent')}>
          {detailsContents.topContent}
        </div>
        <div className={clsx('NotifiAlertDetails__timestamp')}>
          {formatAlertDetailsTimestamp(notificationEntry.createdDate)}
        </div>
      </div>
      <div className={clsx('NotifiAlertDetails__bottomContent')}>
        <div>
          {detailsContents.bottomContent.split('\n').map((content, index) => {
            return <div key={index}>{content}</div>;
          })}
        </div>
        <div>{detailsContents.otherContent}</div>
      </div>
    </div>
  );
};
