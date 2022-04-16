import { NotifiEmailInput } from './NotifiEmailInput';
import { NotifiFooter } from './NotifiFooter';
import { NotifiSmsInput } from './NotifiSmsInput';
import { NotifiSubscribeButton } from './NotifiSubscribeButton';
import React from 'react';

export const NotifiWalletDisconnectedContents: React.FC = ({ children }) => {
  return (
    <>
      <NotifiEmailInput disabled />
      <NotifiSmsInput disabled />
      {children}
      <NotifiSubscribeButton
        disabled
        onClick={() => {
          /* Intentionally empty */
        }}
      />
      <NotifiFooter />
    </>
  );
};
