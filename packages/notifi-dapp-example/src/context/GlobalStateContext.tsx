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

export type GlobalStateContextType = {
  isGlobalLoading: boolean;
  setIsGlobalLoading: Dispatch<SetStateAction<boolean>>;
  globalError: null | string;
  setGlobalError: Dispatch<SetStateAction<string | null>>;
};

const GlobalStateContext = createContext<GlobalStateContextType>({
  isGlobalLoading: false,
  setIsGlobalLoading: () => undefined,
  globalError: null,
  setGlobalError: () => undefined,
});

export const GlobalStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

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
      }}
    >
      {isGlobalLoading ? (
        <div className="fixed h-screen w-screen bg-opacity-80 bg-white">
          <LoadingSpinner />
        </div>
      ) : null}
      {globalError ? (
        <div className="max-w-148 bg-white h-16 border rounded-lg absolute top-10 ml-auto left-2/4 translate-x-[-50%] shadow-md flex items-center justify-center z-10 px-12">
          <Icon id="warning" className="text-notifi-button-primary-bg mr-5" />
          <div>{globalError}</div>
        </div>
      ) : null}
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
