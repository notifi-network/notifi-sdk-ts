'use client';

import { useNotifiHistory } from '@/hooks/useNotifiHistory';
import { Types } from '@notifi-network/notifi-graphql';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

import { HistoryListRow } from './HistoryListRow';
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
        flex flex-col relative grow min-h-0 
      `}
    >
      {nodes.length > 0 ? (
        <div className={`p-6  border-b border-gray-200`}>
          <div className="m-auto mt-4 font-medium text-base ">Inbox</div>
          {unreadCount ? (
            <div className="m-auto text-sm">
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </div>
          ) : null}
        </div>
      ) : null}

      {isLoading && (
        <div className="m-auto absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-5">
          <LoadingSpinner />
        </div>
      )}
      {nodes.length === 0 && !isLoading ? (
        <div className="flex justify-center mt-24">
          <Image
            src={'/logos/empty-inbox.svg'}
            width={404}
            height={317}
            alt="empty-inbox"
          />
        </div>
      ) : null}
      <div className="min-h-0 overflow-scroll grow">
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
