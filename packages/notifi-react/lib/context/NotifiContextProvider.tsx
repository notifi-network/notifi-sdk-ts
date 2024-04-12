import React, { FC, PropsWithChildren } from 'react';

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

export type NotifiContextProviderProps = NotifiFrontendClientProviderProps &
  NotifiTenantConfigProps;

export const NotifiContextProvider: FC<
  PropsWithChildren<NotifiContextProviderProps>
> = ({ children, ...params }) => {
  return (
    <NotifiFrontendClientContextProvider {...params}>
      <NotifiTenantConfigContextProvider cardId={params.cardId}>
        <NotifiTargetContextProvider>
          <NotifiTopicContextProvider>
            <NotifiHistoryContextProvider>
              {children}
            </NotifiHistoryContextProvider>
          </NotifiTopicContextProvider>
        </NotifiTargetContextProvider>
      </NotifiTenantConfigContextProvider>
    </NotifiFrontendClientContextProvider>
  );
};
