import { HistoryItem } from '@notifi-network/notifi-react';
import { FC, useEffect, useState } from 'react';

import { HistoryDetail } from './HistoryDetail';
import { HistoryList } from './HistoryList';

export type DashboardHistoryProps = Readonly<{
  setIsInHistoryDetail: (historyDetailEntry: boolean) => void;
}>;

export const DashboardHistory: React.FC<DashboardHistoryProps> = ({
  setIsInHistoryDetail,
}) => {
  const [historyDetailEntry, setHistoryDetailEntry] =
    useState<HistoryItem | null>(null);

  useEffect(() => {
    if (historyDetailEntry) {
      setIsInHistoryDetail(true);
    }
  }, [historyDetailEntry]);
  return (
    <>
      <HistoryList
        setHistoryDetailEntry={setHistoryDetailEntry}
        historyDetailEntry={historyDetailEntry}
      />
      {historyDetailEntry ? (
        <HistoryDetail
          setIsInHistoryDetail={setIsInHistoryDetail}
          setHistoryDetailEntry={setHistoryDetailEntry}
          historyDetailEntry={historyDetailEntry}
        />
      ) : null}
    </>
  );
};
