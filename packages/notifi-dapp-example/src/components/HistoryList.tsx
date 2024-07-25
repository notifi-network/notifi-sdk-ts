'use client';

import {
  HistoryItem,
  useNotifiHistoryContext,
} from '@notifi-network/notifi-react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { HistoryListRow } from './HistoryListRow';
import { LoadingAnimation } from './LoadingAnimation';
import { LoadingSkeloton } from './LoadingSkeloton';
import { Toggle } from './Toggle';

type HistoryListProps = {
  setHistoryDetailEntry: Dispatch<SetStateAction<HistoryItem | null>>;
  historyDetailEntry: HistoryItem | null;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  setHistoryDetailEntry,
  historyDetailEntry,
}) => {
  const [isLoadingMoreItems, setIsLoadingMoreItems] = useState(false);
  const [isUnread, setIsUnread] = useState(false);
  const {
    isLoading: isLoadingHistoryItems,
    historyItems,
    hasNextPage,
    getHistoryItems,
    unreadCount,
  } = useNotifiHistoryContext();

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return (
    <div
      className={`
        ${historyDetailEntry ? 'hidden' : ''} 
        ${isLoadingHistoryItems ? 'h-full' : ''}
        flex flex-col relative h-max-full overflow-y-auto
      `}
    >
      {historyItems.length > 0 ? (
        <div
          className={`p-6 border-b border-gray-200 border-opacity-20 flex flex-row justify-between items-start`}
        >
          <div>
            <div className="m-auto font-medium text-base text-notifi-text">
              Inbox
            </div>
            {unreadCount ? (
              <div className="m-auto text-sm text-notifi-text-light">
                {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-2">
            <div className="text-notifi-text text-sm">Unreads</div>
            <Toggle
              disabled={false}
              checked={isUnread}
              onChange={() => setIsUnread(!isUnread)}
            />
          </div>
        </div>
      ) : null}

      {isLoadingHistoryItems && !isLoadingMoreItems && (
        <div className="mt-8 ml-20 bg-notifi-card rounded-3xl">
          <LoadingSkeloton />
          <LoadingSkeloton />
          <LoadingSkeloton />
        </div>
      )}
      {historyItems.length === 0 && !isLoadingHistoryItems ? (
        <div className="flex flex-col justify-start h-[88vh] items-center pt-48 px-2">
          <Image
            src={'/logos/empty-inbox.png'}
            width={33}
            height={20}
            alt="empty-inbox"
            unoptimized={true}
          />
          <div className="text-center text-notifi-text mt-2">
            Your inbox is empty
          </div>
          <div className="text-center text-notifi-text-medium max-w-md">
            You currently have no notifications. If anything comes up, you will
            be informed here.
          </div>
        </div>
      ) : null}
      <div ref={mainRef} className="min-h-0 overflow-y-auto grow">
        {historyItems.map((node) => (
          <HistoryListRow
            key={node.id}
            historyDetailEntry={node}
            onClick={() => setHistoryDetailEntry(node)}
          />
        ))}
        {isLoadingMoreItems ? (
          <div
            className={` flex justify-center my-4 text-lg text-notifi-text font-semibold cursor-pointer ${
              !hasNextPage ? 'hidden' : ''
            }`}
          >
            <LoadingAnimation />
          </div>
        ) : null}
      </div>
    </div>
  );
};
