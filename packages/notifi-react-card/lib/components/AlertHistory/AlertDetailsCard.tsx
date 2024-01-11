import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import {
  formatAlertDetailsTimestamp,
  getAlertDetailsContents,
} from 'notifi-react-card/lib/utils';
import React, { useMemo } from 'react';

import NotifiAlertBox, {
  NotifiAlertBoxButtonProps,
  NotifiAlertBoxProps,
} from '../NotifiAlertBox';
import { NotificationHistoryEntry } from '../subscription';

export type AlertDetailsProps = Readonly<{
  notificationEntry: NotificationHistoryEntry;
  classNames?: Readonly<{
    detailsContainer?: string;
    BackArrowIcon?: string;
    NotifiAlertBox?: NotifiAlertBoxProps['classNames'];
    dividerLine?: string;
  }>;
  headerTitle: string;
  headerRightIcon?: NotifiAlertBoxButtonProps;
  onClose?: () => void;
}>;
export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  classNames,
  headerTitle,
  headerRightIcon,
}) => {
  const { setCardView } = useNotifiSubscriptionContext();
  const { bottomContent, otherContent, topContent, bottomContentHtml } =
    useMemo(
      () => getAlertDetailsContents(notificationEntry),
      [notificationEntry],
    );

  const sanitizedBottomContentHtml = useMemo(() => {
    const sanitizedBottomContentHtml =
      bottomContentHtml && DOMPurify.sanitize(bottomContentHtml);
    return sanitizedBottomContentHtml;
  }, [bottomContentHtml]);

  return (
    <>
      <NotifiAlertBox
        classNames={classNames?.NotifiAlertBox}
        leftIcon={{
          name: 'back',
          onClick: () => setCardView({ state: 'history' }),
        }}
        rightIcon={headerRightIcon}
      >
        <h2>{headerTitle}</h2>
      </NotifiAlertBox>
      <div
        className={clsx(
          'NotifiAlertDetails__container',
          classNames?.detailsContainer,
        )}
      >
        <div
          className={clsx('DividerLine historyDetail', classNames?.dividerLine)}
        />
        <div className={clsx('NotifiAlertDetails__topContentContainer')}>
          <div className={clsx('NotifiAlertDetails__topContent')}>
            {topContent}
          </div>
          <div className={clsx('NotifiAlertDetails__timestamp')}>
            {formatAlertDetailsTimestamp(notificationEntry.createdDate)}
          </div>
        </div>
        <div className={clsx('NotifiAlertDetails__bottomContent')}>
          {sanitizedBottomContentHtml ? (
            // If `messageHtml` exists just use it, otherwise use `message` (which is plain text)
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedBottomContentHtml }}
            />
          ) : (
            <div>{bottomContent}</div>
          )}
          <div>{otherContent}</div>
        </div>
      </div>
    </>
  );
};
