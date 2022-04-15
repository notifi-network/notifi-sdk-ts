import type { NotifiCopyData, NotifiStyleData } from '../context';
import {
  NotifiCopyContextProvider,
  NotifiStyleContextProvider,
  NotifiSubscriptionContextProvider,
} from '../context';
import { NotifiCard } from './NotifiCard';
import React from 'react';

export type Props = Readonly<{
  copy: NotifiCopyData;
  classNames: NotifiStyleData;
}>;

export const NotifiCardContainer: React.FC<Props> = ({
  children,
  copy,
  classNames,
}: React.PropsWithChildren<Props>) => {
  return (
    <NotifiSubscriptionContextProvider>
      <NotifiCopyContextProvider {...copy}>
        <NotifiStyleContextProvider {...classNames}>
          <NotifiCard>{children}</NotifiCard>
        </NotifiStyleContextProvider>
      </NotifiCopyContextProvider>
    </NotifiSubscriptionContextProvider>
  );
};
