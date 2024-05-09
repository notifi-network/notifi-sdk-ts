import React, { FC, PropsWithChildren } from 'react';

import { GlobalStateContextProvider } from './GlobalStateContext';
import {
  NotifiFrontendClientContextProvider,
  NotifiFrontendClientProviderProps,
} from './NotifiFrontendClientContext';
import { NotifiHistoryContextProvider } from './NotifiHistoryContext';
import { NotifiTargetContextProvider } from './NotifiTargetContext';
import {
  NotifiTenantConfigContextProvider,
  NotifiTenantConfigProps,
} from './NotifiTenantConfigContext';
import { NotifiTopicContextProvider } from './NotifiTopicContext';
import { NotifiUserSettingContextProvider } from './NotifiUserSettingContext';

export type NotifiContextProviderProps = NotifiFrontendClientProviderProps &
  NotifiTenantConfigProps;

export const NotifiContextProvider: FC<
  PropsWithChildren<NotifiContextProviderProps>
> = ({ children, ...params }) => {
  return (
    <NotifiFrontendClientContextProvider {...params}>
      <NotifiTenantConfigContextProvider
        cardId={params.cardId}
        inputs={params.inputs}
      >
        <NotifiTargetContextProvider>
          <NotifiTopicContextProvider>
            <NotifiHistoryContextProvider>
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
