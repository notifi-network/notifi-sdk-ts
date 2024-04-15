import React, { FC, PropsWithChildren } from 'react';

import {
  NotifiFrontendClientProvider,
  NotifiFrontendClientProviderProps,
} from './NotifiFrontendClientContext';
import { NotifiHistoryContextProvider } from './NotifiHistoryContext';
import { NotifiTargetContextProvider } from './NotifiTargetContext';
import {
  NotifiTenantConfigContextProvider,
  NotifiTenantConfigProps,
} from './NotifiTenantConfigContext';
import { NotifiTopicContextProvider } from './NotifiTopicContext';

export type NotifiContextWrapperProps = NotifiFrontendClientProviderProps &
  NotifiTenantConfigProps;

export const NotifiContextWrapper: FC<
  PropsWithChildren<NotifiContextWrapperProps>
> = ({ children, ...params }) => {
  return (
    <NotifiFrontendClientProvider {...params}>
      <NotifiTenantConfigContextProvider {...params}>
        <NotifiTargetContextProvider>
          <NotifiTopicContextProvider>
            <NotifiHistoryContextProvider>
              {children}
            </NotifiHistoryContextProvider>
          </NotifiTopicContextProvider>
        </NotifiTargetContextProvider>
      </NotifiTenantConfigContextProvider>
    </NotifiFrontendClientProvider>
  );
};
