import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  HistoryItem,
  useNotifiHistoryContext,
  useNotifiTargetContext,
} from '../context';
import { defaultCopy, defaultLoadingAnimationStyle, hasTarget } from '../utils';
import { HistoryRow } from './HistoryRow';
import { InboxView } from './Inbox';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader } from './NavHeader';
import { TargetStateBanner, TargetStateBannerProps } from './TargetStateBanner';

type HistoryListProps = {
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  classNames?: {
    container?: string;
    main?: string;
    button?: string;
    loadingSpinner?: React.CSSProperties;
    loadingMore?: string;
    inboxEmpty?: string;
    emptyIcon?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    TargetStateBannerContainer?: string;
    TargetStateBanner?: TargetStateBannerProps['classNames'];
  };
  copy?: {
    headerTitle?: string;
    buttonText?: string;
    emptyTitle?: string;
    emptyDescription?: string;
  };
  emptyIcon?: IconType;
  setSelectedHistoryItem: React.Dispatch<
    React.SetStateAction<HistoryItem | null>
  >;
  isHidden: boolean;
};

export const HistoryList: React.FC<HistoryListProps> = (props) => {
  const {
    historyItems,
    hasNextPage,
    getHistoryItems,
    isLoading: isLoadingHistoryItems,
  } = useNotifiHistoryContext();
  const [isLoadingMoreItems, setIsLoadingMoreItems] = React.useState(false);
  const loadingSpinnerStyle: React.CSSProperties =
    props.classNames?.loadingSpinner ?? defaultLoadingAnimationStyle.spinner;
  const mainRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // NOTE: Light weight implementation of infinite scroll
    const scrollDetectedAction = async () => {
      const scrollTop = mainRef.current?.scrollTop ?? 0;
      const scrollHeight = mainRef.current?.scrollHeight ?? 0;
      const offsetHeight = mainRef.current?.offsetHeight ?? 0;
      const edgeBuffer = 10; // this buffer vary based on the css config (border, padding, margin size)
      if (scrollTop > scrollHeight - offsetHeight - edgeBuffer) {
        if (isLoadingHistoryItems || !hasNextPage) return;
        setIsLoadingMoreItems(true);
        await getHistoryItems();
        setIsLoadingMoreItems(false);
      }
    };
    mainRef.current?.addEventListener('scroll', scrollDetectedAction);
    return () =>
      mainRef.current?.removeEventListener('scroll', scrollDetectedAction);
  }, [hasNextPage, isLoadingHistoryItems]);

  const {
    targetDocument: { targetData },
  } = useNotifiTargetContext();

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
      <div
        className={clsx(
          'notifi-history-list-target-state-banner-container',
          props.classNames?.TargetStateBannerContainer,
        )}
      >
        <TargetStateBanner
          classNames={props.classNames?.TargetStateBanner}
          onClickCta={() => {
            if (!hasTarget(targetData)) {
              return props.setInboxView(InboxView.InboxConfigTargetEdit);
            }
            props.setInboxView(InboxView.InboxConfigTargetList);
          }}
        />
      </div>

      <div
        ref={mainRef}
        className={clsx('notifi-history-list-main', props.classNames?.main)}
      >
        {/* HistoryList */}
        {historyItems.map((item, id) => (
          <HistoryRow
            key={id}
            historyItem={item}
            onClick={() => props.setSelectedHistoryItem(item)}
          />
        ))}
        {/* Load more */}
        {isLoadingMoreItems ? (
          <div
            className={clsx(
              'notifi-history-list-loading-more',
              props.classNames?.loadingMore,
              !hasNextPage && 'hidden',
            )}
          >
            <LoadingAnimation type="spinner" {...loadingSpinnerStyle} />
          </div>
        ) : null}
        {/* EmptyInbox */}
        {!isLoadingHistoryItems && historyItems.length === 0 ? (
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
              <Icon type={props.emptyIcon ?? 'empty-box'} />
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
