import { NotifiEmailInput } from './NotifiEmailInput';
import { NotifiSmsInput } from './NotifiSmsInput';
import React from 'react';

export const NotifiSubscriptionForm: React.FC = () => {
  return (
    <>
      <NotifiEmailInput />
      <NotifiSmsInput />
    </>
  );
};
