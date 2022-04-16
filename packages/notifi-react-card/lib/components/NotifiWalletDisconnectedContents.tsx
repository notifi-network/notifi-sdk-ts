import React from 'react';
import { NotifiEmailInput } from './NotifiEmailInput';
import { NotifiSmsInput } from './NotifiSmsInput';
import { NotifiSubscribeButton } from './NotifiSubscribeButton';
import { NotifiFooter } from './NotifiFooter';

export const NotifiWalletDisconnectedContents: React.FC = ({ children }) => {
  return (
    <>
      <NotifiEmailInput disabled />
      <NotifiSmsInput disabled />
      {children}
      <NotifiSubscribeButton disabled onClick={() => {}} />
      <NotifiFooter />
    </>
  );
};
