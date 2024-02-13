'use client';

import { CardView } from '@/app/notifi/dashboard/page';
import { Dispatch, SetStateAction } from 'react';

type HistoryDetailProps = {
  setCardView: Dispatch<SetStateAction<CardView>>;
};
export const HistoryDetail: React.FC<HistoryDetailProps> = ({
  setCardView,
}) => {
  return (
    <div>
      <div
        className="p-5 rounded-lg bg-sky-400 w-32"
        onClick={() => setCardView('history')}
      >
        back button
      </div>
      Dummy History Detail
    </div>
  );
};
