import clsx from 'clsx';
import React from 'react';

import { HistoryItem, useNotifiHistoryContext } from '../context';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils';
import { HistoryRow } from './HistoryRow';
import { InboxView } from './Inbox';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';

type InboxHistoryListProps = {
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
  };
  setSelectedHistoryItem: React.Dispatch<
    React.SetStateAction<HistoryItem | null>
  >;
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  // inboxView: InboxView;
  isHidden: boolean;
};

export const InboxHistoryList: React.FC<InboxHistoryListProps> = (props) => {
  const { historyItems, hasNextPage, getHistoryItems } =
    useNotifiHistoryContext();
  const [isLoadingMoreItems, setIsLoadingMoreItems] = React.useState(false);
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;
  return (
    <div
      className={clsx(
        'notifi-inbox-history-list',
        props.isHidden && 'hidden',
        props.classNames?.container,
      )}
    >
      <NavHeader>
        {props.copy?.headerTitle ?? defaultCopy.inboxHistoryList.headerTitle}
      </NavHeader>
      <div
        className={clsx(
          'notifi-inbox-history-list-main',
          props.classNames?.main,
        )}
      >
        {/* TODO: stay here for now for ref <div>loaded items count: {JSON.stringify(historyItems.length)}</div>
        <div>unread count: {JSON.stringify(unreadCount)}</div> */}
        {historyItems.map((item, id) => (
          <HistoryRow
            key={id}
            historyItem={item}
            onClick={() => {
              props.setSelectedHistoryItem(item);
              props.setInboxView(InboxView.InboxHistoryDetail);
            }}
          />
        ))}
        {hasNextPage ? (
          <button
            className={clsx(
              'notifi-inbox-history-list-button',
              props.classNames?.button,
              !hasNextPage && 'hidden',
            )}
            disabled={isLoadingMoreItems}
            onClick={async () => {
              setIsLoadingMoreItems(true);
              await getHistoryItems();
              setIsLoadingMoreItems(false);
            }}
          >
            {isLoadingMoreItems ? (
              <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
            ) : null}
            <div
              className={clsx(
                'notifi-inbox-history-list-button-text',
                isLoadingMoreItems && 'hidden',
              )}
            >
              {props.copy?.buttonText ??
                defaultCopy.inboxHistoryList.buttonText}
            </div>
          </button>
        ) : null}
      </div>
    </div>
  );
};
