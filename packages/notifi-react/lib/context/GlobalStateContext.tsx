import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export type GlobalLoading = {
  isLoading: boolean;
  loadingData?: string; // Allowing to pass custom string data to be parsed by JSON.parse
};

export type GlobalError = {
  error: Error;
  errorData?: string; // Allowing to pass custom string data to be parsed by JSON.parse
};

export enum CtaTypeEnum {
  onClose = 'onClose',
}

export type CtaType = `${CtaTypeEnum}`;

export type GlobalCtas = Record<CtaType, () => void>;

export type GlobalStateContextType = {
  globalLoading: GlobalLoading;
  setGlobalLoading: Dispatch<SetStateAction<GlobalLoading>>;
  globalError: GlobalError | null;
  setGlobalError: Dispatch<SetStateAction<GlobalError | null>>;
  globalCtas: GlobalCtas | null;
  setGlobalCtas: Dispatch<SetStateAction<GlobalCtas | null>>;
};

const GlobalStateContext = createContext<GlobalStateContextType>({
  globalLoading: { isLoading: false },
  setGlobalLoading: () => undefined,
  globalError: null,
  setGlobalError: () => undefined,
  globalCtas: null,
  setGlobalCtas: () => undefined,
});

export const GlobalStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [globalLoading, setGlobalLoading] = useState<GlobalLoading>({
    isLoading: false,
  });

  const [globalError, setGlobalError] = useState<GlobalError | null>(null);

  const [globalCtas, setGlobalCtas] = useState<GlobalCtas | null>(null);

  return (
    <GlobalStateContext.Provider
      value={{
        globalLoading,
        setGlobalLoading,
        globalError,
        setGlobalError,
        globalCtas,
        setGlobalCtas,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
