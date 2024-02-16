'use client';

import { Icon } from '@/assets/Icon';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type IsInitialized = 'notInitialize' | 'initialized' | 'initializing';

export type GlobalStateContextType = {
  isGlobalLoading: boolean;
  setIsGlobalLoading: Dispatch<SetStateAction<boolean>>;
  globalError: null | string;
  setGlobalError: Dispatch<SetStateAction<string | null>>;
  isInitialized: IsInitialized;
  seIisInitialized: Dispatch<SetStateAction<IsInitialized>>;
};

const GlobalStateContext = createContext<GlobalStateContextType>({
  isGlobalLoading: false,
  setIsGlobalLoading: () => undefined,
  globalError: null,
  setGlobalError: () => undefined,
  isInitialized: 'notInitialize',
  seIisInitialized: () => undefined,
});

export const GlobalStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isInitialized, seIisInitialized] =
    useState<IsInitialized>('notInitialize');

  useEffect(() => {
    if (globalError) {
      setTimeout(() => {
        setGlobalError(null);
      }, 5000);
    }
  }, [globalError]);

  return (
    <GlobalStateContext.Provider
      value={{
        isGlobalLoading,
        setIsGlobalLoading,
        globalError,
        setGlobalError,
        isInitialized,
        seIisInitialized,
      }}
    >
      {isGlobalLoading ? (
        <div className="fixed h-screen w-screen bg-opacity-80 bg-white">
          <LoadingSpinner />
        </div>
      ) : null}
      {globalError ? (
        <div className="w-[29rem] bg-white h-16 border rounded-lg absolute top-10 ml-auto left-2/4 translate-x-[-50%] shadow-md flex items-center justify-center">
          <Icon id="warning" className="text-notifi-button-primary-bg mr-5" />
          <div>{globalError}</div>
        </div>
      ) : null}
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
