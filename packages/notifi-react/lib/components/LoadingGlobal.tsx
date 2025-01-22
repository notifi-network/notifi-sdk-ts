import React from 'react';

import { useGlobalStateContext } from '../context/GlobalStateContext';

export type LoadingGlobalProps = {
  copy?: {
    header: string;
  };
};

export const LoadingGlobal: React.FC = () => {
  const { globalLoading } = useGlobalStateContext();
  // NOTE: Not being used by far. Currently no global loading state for NotifiCardModal
  return (
    <div>
      {globalLoading.loadingData ? <h1>{globalLoading.loadingData}</h1> : null}
      <h1>Loading ...</h1>
      <div>{globalLoading.loadingData ? globalLoading.loadingData : null}</div>
    </div>
  );
};
