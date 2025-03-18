import {
  NotifiContextProviderProps,
  NotifiFrontendClientContextProvider,
  NotifiHistoryContextProvider,
  NotifiTargetContextProvider,
  NotifiTenantConfigContextProvider,
  NotifiTopicContextProvider,
  NotifiUserSettingContextProvider,
} from '@notifi-network/notifi-react';

/**  NOTE: ⬇ internal context, only available within notifi-sdk-ts workspace */
import { GlobalStateContextProvider } from 'notifi-react/lib/context/GlobalStateContext';
import React, { FC, PropsWithChildren } from 'react';

import { useXmpt } from '../hooks';

export type NotifiContextProviderWithWalletTargetPluginProps =
  NotifiContextProviderProps;

export const NotifiContextProviderWithWalletTargetPlugin: FC<
  PropsWithChildren<NotifiContextProviderProps>
> = ({ children, ...params }) => {
  const {
    tenantId,
    env,
    storageOption,
    isEnabledLoginViaTransaction,
    ...walletWithSignParams
  } = params;
  const contextValue = useXmpt({
    walletWithSignParams,
  });
  return (
    <NotifiFrontendClientContextProvider {...params}>
      <NotifiTenantConfigContextProvider
        cardId={params.cardId}
        inputs={params.inputs}
      >
        <NotifiTargetContextProvider
          toggleTargetAvailability={params.toggleTargetAvailability}
          plugin={{ walletTarget: contextValue }}
        >
          <NotifiTopicContextProvider>
            <NotifiHistoryContextProvider
              notificationCountPerPage={params.notificationCountPerPage}
              unreadCountScope={params.unreadCountScope}
            >
              <NotifiUserSettingContextProvider>
                <GlobalStateContextProvider>
                  {children}
                </GlobalStateContextProvider>
              </NotifiUserSettingContextProvider>
            </NotifiHistoryContextProvider>
          </NotifiTopicContextProvider>
        </NotifiTargetContextProvider>
      </NotifiTenantConfigContextProvider>
    </NotifiFrontendClientContextProvider>
  );
};
