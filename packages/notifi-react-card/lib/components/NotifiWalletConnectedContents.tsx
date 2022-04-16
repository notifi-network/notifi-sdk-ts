import React from 'react';

import { NotifiEmailInput } from './NotifiEmailInput';
import { NotifiSmsInput } from './NotifiSmsInput';
import { NotifiSubscribeButton } from './NotifiSubscribeButton';
import { NotifiFooter } from './NotifiFooter';
import { useNotifiSubscribe } from '../hooks';

type SubscribeParams = Parameters<typeof useNotifiSubscribe>[0];
type Props = Readonly<SubscribeParams>;

export const NotifiWalletConnectedContents: React.FC<Props> = ({
  children,
  ...subscribeParams
}: React.PropsWithChildren<Props>) => {
  const { loading, subscribe } = useNotifiSubscribe(subscribeParams);

  return (
    <>
      <NotifiEmailInput disabled={loading} />
      <NotifiSmsInput disabled={loading} />
      {children}
      <NotifiSubscribeButton disabled={loading} onClick={subscribe} />
      <NotifiFooter />
    </>
  );
};
