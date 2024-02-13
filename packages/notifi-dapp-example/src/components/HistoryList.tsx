'use client';

import { CardView } from '@/app/notifi/dashboard/page';
import { Dispatch, SetStateAction } from 'react';

type HistoryListProps = {
  setCardView: Dispatch<SetStateAction<CardView>>;
};

export const HistoryList: React.FC<HistoryListProps> = ({ setCardView }) => {
  return (
    <div>
      <div onClick={() => setCardView('historyDetail')}>Dummy history item</div>
    </div>
  );
};
