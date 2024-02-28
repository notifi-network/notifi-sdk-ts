import { Types } from '@notifi-network/notifi-graphql';
import { FC, useState } from 'react';

import { HistoryDetail } from './HistoryDetail';
import { HistoryList } from './HistoryList';

export const DashboardHistory: FC = () => {
  const [historyDetailEntry, setHistoryDetailEntry] =
    useState<Types.FusionNotificationHistoryEntryFragmentFragment | null>(null);
  return (
    <>
      <HistoryList
        setHistoryDetailEntry={setHistoryDetailEntry}
        historyDetailEntry={historyDetailEntry}
      />
      {historyDetailEntry ? (
        <HistoryDetail
          setHistoryDetailEntry={setHistoryDetailEntry}
          historyDetailEntry={historyDetailEntry}
        />
      ) : null}
    </>
  );
};
