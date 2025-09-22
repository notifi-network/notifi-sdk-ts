'use client';

import { Icon } from '@/assets/Icon';
import { SpriteIconId } from '@/assets/SpriteIconId';
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
  popGlobalInfoModal: (globalInfoModal: GlobalInfoModal | null) => void;
};

const GlobalStateContext = createContext<GlobalStateContextType>({
  isGlobalLoading: false,
  setIsGlobalLoading: () => undefined,
  popGlobalInfoModal: () => undefined,
});

export type GlobalInfoModal = {
  message: string;
  iconOrEmoji: SpriteIcon | Emoji;
  timeout: number /* in milliseconds */;
};

type SpriteIcon = { type: 'icon'; id: SpriteIconId };
type Emoji = { type: 'emoji'; content: string };

export const GlobalStateContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  const [globalInfoModal, setGlobalInfoModal] =
    useState<GlobalInfoModal | null>(null);

  const popGlobalInfoModal = (modalData: Partial<GlobalInfoModal> | null) => {
    setGlobalInfoModal(() => {
      if (!modalData) return null;
      return {
        message: modalData.message || 'WARNING: Something went wrong',
        iconOrEmoji: modalData.iconOrEmoji || { type: 'icon', id: 'warning' },
        timeout: modalData.timeout || 5000,
      };
    });
  };

  useEffect(() => {
    if (globalInfoModal) {
      setTimeout(() => {
        setGlobalInfoModal(null);
      }, globalInfoModal.timeout);
    }
  }, [globalInfoModal]);

  return (
    <GlobalStateContext.Provider
      value={{
        isGlobalLoading,
        setIsGlobalLoading,
        popGlobalInfoModal,
      }}
    >
      {isGlobalLoading ? (
        <div className="fixed h-screen w-screen bg-opacity-50 bg-black z-50">
          <LoadingSpinner />
        </div>
      ) : null}

      {globalInfoModal ? (
        <div className="max-w-148 bg-notifi-destination-card-bg sm:h-16 rounded-lg absolute top-10 ml-auto left-2/4 translate-x-[-50%] flex items-center justify-center z-10 sm:px-12 px-2 py-1 md:py-0">
          {globalInfoModal.iconOrEmoji.type === 'icon' ? (
            <Icon
              id={globalInfoModal.iconOrEmoji.id}
              className="text-notifi-button-primary-bg mr-5"
            />
          ) : (
            <div className="mr-5">{globalInfoModal.iconOrEmoji.content}</div>
          )}
          <div className="w-full text-notifi-text-medium">
            {globalInfoModal.message}
          </div>
        </div>
      ) : null}
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalStateContext = () => useContext(GlobalStateContext);
