import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { HistoryItem, useNotifiHistoryContext } from '../context';
import { defaultCopy, defaultLoadingAnimationStyle } from '../utils';
import { HistoryRow } from './HistoryRow';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';

type HistoryListProps = {
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    inboxEmpty?: string;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyDescription?: string;
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
    emptyTitle?: string;
    emptyDescription?: string;
  };
  setSelectedHistoryItem: React.Dispatch<
    React.SetStateAction<HistoryItem | null>
  >;
  isHidden: boolean;
};

export const HistoryList: React.FC<HistoryListProps> = (props) => {
  const { historyItems, hasNextPage, getHistoryItems } =
    useNotifiHistoryContext();
  const [isLoadingMoreItems, setIsLoadingMoreItems] = React.useState(false);
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;
  return (
    <div
      className={clsx(
        'notifi-history-list',
        props.isHidden && 'hidden',
        props.classNames?.container,
      )}
    >
      <NavHeader>
        {props.copy?.headerTitle ?? defaultCopy.inboxHistoryList.headerTitle}
      </NavHeader>
      <div className={clsx('notifi-history-list-main', props.classNames?.main)}>
        {/* HistoryList */}
        {historyItems.map((item, id) => (
          <HistoryRow
            key={id}
            historyItem={item}
            onClick={() => props.setSelectedHistoryItem(item)}
          />
        ))}
        {/* Load more */}
        {hasNextPage ? (
          <button
            className={clsx(
              'notifi-history-list-button',
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
                'notifi-history-list-button-text',
                isLoadingMoreItems && 'hidden',
              )}
            >
              {props.copy?.buttonText ??
                defaultCopy.inboxHistoryList.buttonText}
            </div>
          </button>
        ) : null}
        {/* EmptyInbox */}
        {historyItems.length === 0 ? (
          <div
            className={clsx(
              'notifi-history-list-empty',
              props.classNames?.inboxEmpty,
            )}
          >
            <div
              className={clsx(
                'notifi-history-list-empty-icon',
                props.classNames?.emptyIcon,
              )}
            >
              <Icon type="empty-box" />
            </div>

            <div
              className={clsx(
                'notifi-history-list-empty-title',
                props.classNames?.emptyTitle,
              )}
            >
              {props.copy?.emptyTitle ??
                defaultCopy.historyList.inboxEmptyTitle}
            </div>
            <div
              className={clsx(
                'notifi-history-list-empty-description',
                props.classNames?.emptyDescription,
              )}
            >
              {props.copy?.emptyDescription ??
                defaultCopy.historyList.inboxEmptyDescription}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
