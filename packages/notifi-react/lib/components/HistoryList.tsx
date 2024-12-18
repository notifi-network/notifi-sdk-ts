import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  HistoryItem,
  useNotifiHistoryContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '../context';
import { defaultCopy, hasTarget } from '../utils';
import { HistoryRow } from './HistoryRow';
import { InboxView } from './Inbox';
import { LoadingAnimation } from './LoadingAnimation';
import { NavHeader, NavHeaderProps, NavHeaderRightCta } from './NavHeader';
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
    NavHeader?: NavHeaderProps['classNames'];
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
  navHeaderRightCta?: NavHeaderRightCta;
};

export const HistoryList: React.FC<HistoryListProps> = (props) => {
  const {
    historyItems,
    hasNextPage,
    getHistoryItems,
    isLoading: isLoadingHistoryItems,
  } = useNotifiHistoryContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const [isLoadingMoreItems, setIsLoadingMoreItems] = React.useState(false);
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
    unVerifiedTargets,
  } = useNotifiTargetContext();

  const isShowingTargetStateBanner =
    unVerifiedTargets.length > 0 ||
    (!hasTarget(targetData) && !cardConfig?.isContactInfoRequired);

  return (
    <div
      data-cy="notifi-history-list"
      className={clsx(
        'notifi-history-list',
        props.isHidden && 'hidden',
        props.classNames?.container,
      )}
    >
      <NavHeader
        rightCta={props.navHeaderRightCta}
        classNames={
          props.classNames?.NavHeader ?? {
            container: 'notifi-inbox-history-list-header',
          }
        }
      >
        {props.copy?.headerTitle ?? defaultCopy.inboxHistoryList.headerTitle}
      </NavHeader>
      {isShowingTargetStateBanner ? (
        <div
          className={clsx(
            'notifi-history-list-target-state-banner-container',
            props.classNames?.TargetStateBannerContainer,
          )}
        >
          <TargetStateBanner
            classNames={props.classNames?.TargetStateBanner}
            onClickCta={() => {
              props.setInboxView(InboxView.InboxConfigTargetList);
            }}
            parentComponent="history"
          />
        </div>
      ) : null}

      <div
        ref={mainRef}
        className={clsx(
          'notifi-history-list-main',
          props.classNames?.main,
          isShowingTargetStateBanner ? 'w-banner' : '',
        )}
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
            <LoadingAnimation
              type="spinner"
              classNames={{
                spinner: 'notifi-history-list-loading-more-spinner',
              }}
            />
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
