import { HistoryItem } from '@notifi-network/notifi-react';
import { FC, useState } from 'react';

import { HistoryDetail } from './HistoryDetail';
import { HistoryList } from './HistoryList';

export const DashboardHistory: FC = () => {
  const [historyDetailEntry, setHistoryDetailEntry] =
    useState<HistoryItem | null>(null);
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
