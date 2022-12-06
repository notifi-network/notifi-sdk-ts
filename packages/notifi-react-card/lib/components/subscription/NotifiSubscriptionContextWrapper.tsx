import {
  NotifiSubscriptionContextProvider,
  useNotifiClientContext,
} from 'notifi-react-card/lib';
import React from 'react';

export type NotifiSubscriptionContextWrapper = Readonly<{
  cardId: string;
}>;

export const NotifiSubscriptionContextWrapper: React.FC<
  React.PropsWithChildren<NotifiSubscriptionContextWrapper>
> = (props: React.PropsWithChildren<NotifiSubscriptionContextWrapper>) => {
  const { params } = useNotifiClientContext();
  const { children } = props;

  return (
    <NotifiSubscriptionContextProvider {...params}>
      {children}
    </NotifiSubscriptionContextProvider>
  );
};
