import { NotificationHistoryEntry } from '@notifi-network/notifi-core';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { BackArrow } from '../../assets/backArrow';
import { formatAlertDetailsTimestamp } from '../../utils/AlertHistoryUtils';

export type AlertDetailsProps = Readonly<{
  notificationEntry: NotificationHistoryEntry;
  handleClose: () => void;
  classNames?: Readonly<{
    detailsContainer?: string;
    backArrow?: string;
  }>;
}>;
export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  handleClose,
  classNames,
}) => {
  const timestamp = notificationEntry.createdDate;
  const content = useMemo(() => {
    const detail = notificationEntry?.detail;
    const typename = detail?.__typename;
    if (detail === undefined || typename === undefined) {
      return {};
    }

    switch (typename) {
      case 'BroadcastMessageEventDetails': {
        return {
          topContent: detail.subject,
          bottomContent: detail.message,
        };
      }
    }

    return {};
  }, []);
  return (
    <div
      className={clsx(
        'NotifiAlertDetails__container',
        classNames?.detailsContainer,
      )}
    >
      <div
        className={clsx('NotifiAlertDetails__backArrow', classNames?.backArrow)}
        onClick={handleClose}
      >
        <BackArrow />
      </div>
      <div className="NotifiAlertDetails__dialogHeader">
        <span className="NotifiAlertDetails__headerLabel">
          <label className="NotifiAlertDetails__headerContent">
            Alert Details
          </label>
        </span>
      </div>
      <div className={clsx('NotifiAlertDetails__dividerLine')} />
      <div className={clsx('NotifiAlertDetails__contentContainer')}>
        <div className={clsx('NotifiAlertDetails__topContentContainer')}>
          <div className={clsx('NotifiAlertDetails__topContent')}>
            {content.topContent}
          </div>
          <div className={clsx('NotifiAlertDetails__timestamp')}>
            {formatAlertDetailsTimestamp(timestamp)}
          </div>
        </div>
      </div>
      <div className={clsx('NotifiAlertDetails__bottomContent')}>
        {content.bottomContent}
      </div>
    </div>
  );
};
