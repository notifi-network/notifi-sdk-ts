import type { NotifiCopyData, NotifiStyleData } from '../context';
import {
  NotifiCopyContextProvider,
  NotifiStyleContextProvider,
  NotifiSubscriptionContextProvider,
} from '../context';
import React from 'react';

export type Props = Readonly<{
  copy: NotifiCopyData;
  styles: NotifiStyleData;
}>;

export const NotifiCardContainer: React.FC<Props> = ({
  children,
  copy,
  styles,
}: React.PropsWithChildren<Props>) => {
  return (
    <NotifiSubscriptionContextProvider>
      <NotifiCopyContextProvider {...copy}>
        <NotifiStyleContextProvider {...styles}>
          {children}
        </NotifiStyleContextProvider>
      </NotifiCopyContextProvider>
    </NotifiSubscriptionContextProvider>
  );
};
