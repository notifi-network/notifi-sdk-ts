'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { validateEventDetails } from '@/utils/notificationHistory';
import { Types } from '@notifi-network/notifi-graphql';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
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
  const [cursorInfo, setCursorInfo] = useState<CursorInfo>({
    hasNextPage: false,
    endCursor: undefined,
  });
  const historyLoaded = useRef<boolean>(false);
  const { cardConfig } = useNotifiCardContext();

  const cardEventTypeNames = new Set(
    cardConfig?.eventTypes?.map((event) => event.name) ?? [],
  );

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
        flex flex-col gap-2 relative
      `}
    >
      {isLoading && (
        <div className="m-auto absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-5">
          <LoadingSpinner />
        </div>
      )}
      <div className="m-auto mt-4 mb-6 text-lg font-extrabold">Alert Inbox</div>
      {nodes.map((node) => (
        <HistoryListRow
          key={node.id}
          historyDetailEntry={node}
          setHistoryDetailEntry={setHistoryDetailEntry}
        />
      ))}
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
