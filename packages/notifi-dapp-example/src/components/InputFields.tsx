import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { DiscordInput } from './DiscordInput';
import { EmailInput } from './EmailInput';
import { SlackInput } from './SlackInput';
// import {
//   NotifiHwWalletToggle,
//   NotifiHwWalletToggleProps,
// } from '../../NotifiHwWalletToggle';
// import { NotifiSmsInput, NotifiSmsInputProps } from '../../NotifiSmsInput';
import { TelegramInput } from './TelegramInput';

export type InputFieldsProps = {
  data: CardConfigItemV1;
  allowedCountryCodes?: string[];
  inputDisabled: boolean;
  hideContactInputs?: boolean;
};
export const InputFields: React.FC<InputFieldsProps> = ({
  data,
  // allowedCountryCodes,
  inputDisabled,
  hideContactInputs,
}) => {
  return (
    <>
      {!hideContactInputs ? (
        <div className="flex flex-col justify-center items-center">
          {data.contactInfo.email.active ? (
            <EmailInput disabled={inputDisabled} />
          ) : null}
          <SlackInput disabled={inputDisabled} />
          {data.contactInfo?.discord?.active ? (
            <DiscordInput disabled={inputDisabled} />
          ) : null}
          {data.contactInfo.telegram.active ? (
            <TelegramInput disabled={inputDisabled} />
          ) : null}
        </div>
      ) : null}
      {/* {params.walletBlockchain === 'SOLANA' ? (
        <NotifiHwWalletToggle
          disabled={inputDisabled}
          classNames={classNames?.NotifiHwWalletToggle}
        />
      ) : null} */}
    </>
  );
};
