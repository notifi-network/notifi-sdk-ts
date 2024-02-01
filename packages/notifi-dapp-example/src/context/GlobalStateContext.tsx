'use client';

import { LoadingGlobal } from '@/components/LoadingGlobal';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type GlobalStateContextType = {
  isGlobalLoading: boolean;
  setIsGlobalLoading: Dispatch<SetStateAction<boolean>>;
};

const GlobalStateContext = createContext<GlobalStateContextType>({
  isGlobalLoading: false,
  setIsGlobalLoading: () => undefined,
  // TODO: Global error state ( design TBD )
});

export const GlobalStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  return (
    <GlobalStateContext.Provider
      value={{ isGlobalLoading, setIsGlobalLoading }}
    >
      {isGlobalLoading ? <LoadingGlobal /> : null}
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
