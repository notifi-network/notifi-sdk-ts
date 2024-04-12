'use client';

import { useNotifiHistory } from '@/hooks/useNotifiHistory';
import { Types } from '@notifi-network/notifi-graphql';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { HistoryListRow } from './HistoryListRow';
import { LoadingSkeloton } from './LoadingSkeloton';
import { LoadingSpinner } from './LoadingSpinner';

type HistoryListProps = {
  setHistoryDetailEntry: Dispatch<
    SetStateAction<Types.FusionNotificationHistoryEntryFragmentFragment | null>
  >;
  historyDetailEntry: Types.FusionNotificationHistoryEntryFragmentFragment | null;
};

export const HistoryList: React.FC<HistoryListProps> = ({
  setHistoryDetailEntry,
  historyDetailEntry,
}) => {
  const {
    isLoading,
    cursorInfo,
    nodes,
    unreadCount,
    setUnreadCount,
    getNotificationHistory,
  } = useNotifiHistory(true);

  // useEffect(() => {
  //   // TODO: TBD feature
  //   return () => {
  //     if (!historyLoaded.current) return;
  //     // markNotifiHistoryAsRead();
  //   };
  // }, []);

  return (
    <div
      className={`
        ${historyDetailEntry ? 'hidden' : ''} 
        ${isLoading ? 'h-full' : ''}
        flex flex-col relative h-max-full overflow-y-auto
      `}
    >
      {nodes.length > 0 ? (
        <div className={`p-6 border-b border-gray-200 border-opacity-20`}>
          <div className="m-auto font-medium text-base text-notifi-text">
            Inbox
          </div>
          {unreadCount ? (
            <div className="m-auto text-sm text-notifi-text-light">
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </div>
          ) : null}
        </div>
      ) : null}

      {isLoading && (
        <div className="mt-8 ml-20 bg-notifi-card rounded-3xl">
          <LoadingSkeloton />
          <LoadingSkeloton />
          <LoadingSkeloton />
        </div>
      )}
      {nodes.length === 0 && !isLoading ? (
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
      <div className="min-h-0 overflow-y-scroll grow">
        {nodes.map((node) => (
          <HistoryListRow
            key={node.id}
            historyDetailEntry={node}
            setHistoryDetailEntry={setHistoryDetailEntry}
            setUnreadCount={setUnreadCount}
          />
        ))}
        <div
          className={` flex justify-center my-4 text-lg font-semibold cursor-pointer ${
            !cursorInfo.hasNextPage ? 'hidden' : ''
          }`}
          onClick={() => getNotificationHistory()}
        >
          <div>Load more</div>
        </div>
      </div>
    </div>
  );
};
