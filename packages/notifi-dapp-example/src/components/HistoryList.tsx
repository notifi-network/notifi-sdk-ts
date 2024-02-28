'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { validateEventDetails } from '@/utils/notifiHistoryUtils';
import { Types } from '@notifi-network/notifi-graphql';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { HistoryListRow } from './HistoryListRow';
import { LoadingSpinner } from './LoadingSpinner';

type HistoryListProps = {
  setHistoryDetailEntry: Dispatch<
    SetStateAction<Types.FusionNotificationHistoryEntryFragmentFragment | null>
  >;
  historyDetailEntry: Types.FusionNotificationHistoryEntryFragmentFragment | null;
};

type CursorInfo = Readonly<{
  hasNextPage: boolean;
  endCursor?: string | undefined;
}>;

const messagePerPage = 50;

export const HistoryList: React.FC<HistoryListProps> = ({
  setHistoryDetailEntry,
  historyDetailEntry,
}) => {
  const { frontendClient } = useNotifiClientContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setGlobalError } = useGlobalStateContext();
  const [nodes, setNodes] = useState<
    Types.FusionNotificationHistoryEntryFragmentFragment[]
  >([]);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    hasNextPage: false,
    endCursor: undefined,
  });
  const historyLoaded = useRef<boolean>(false);
  const { cardConfig } = useNotifiCardContext();

  const cardEventTypeNames = new Set(
    cardConfig?.eventTypes?.map((event) => event.name) ?? [],
  );

  // TODO: move to useNotifiHistory hook
  const getNotificationHistory = (initialLoad?: boolean) => {
    if (!initialLoad && !cursorInfo.hasNextPage) {
      setGlobalError('No more notification history to fetch');
      return;
    }
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    frontendClient
      .getFusionNotificationHistory({
        first: messagePerPage,
        after: cursorInfo.endCursor,
        includeHidden: false,
      })
      .then((result) => {
        if (!result || result.nodes?.length === 0 || !result.nodes) {
          return;
        }
        // Filter out events that are not supported by the card
        result.nodes.filter((node) => {
          if (!node.detail || !validateEventDetails(node.detail)) return false;
          return cardEventTypeNames.has(node.detail.sourceName);
        });

        setNodes((existing) =>
          initialLoad
            ? result.nodes ?? []
            : [...existing, ...(result.nodes ?? [])],
        );
        setCursorInfo(result.pageInfo);
        historyLoaded.current = true;
      })
      .catch((e) => {
        setGlobalError(
          'ERROR: Failed to fetch notification history, check console for more details',
        );
        console.error('Failed to fetch notification history', e);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getNotificationHistory(true);
    frontendClient.getUnreadNotificationHistoryCount().then(({ count }) => {
      setUnreadCount(count);
    });
  }, [frontendClient]);

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
      </div>
      <div
        className={`m-auto mt-4 text-lg font-semibold cursor-pointer ${
          !cursorInfo.hasNextPage ? 'hidden' : ''
        }`}
        onClick={() => getNotificationHistory()}
      >
        Load more
      </div>
    </div>
  );
};
