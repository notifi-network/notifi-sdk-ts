import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { DiscordInput } from './DiscordInput';
import { EmailInput } from './EmailInput';
import { SlackInput } from './SlackInput';
import { TelegramInput } from './TelegramInput';

export type InputFieldsProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  inputDisabled: boolean;
  isEdit?: boolean;
};
export const InputFields: React.FC<InputFieldsProps> = ({
  contactInfo,
  inputDisabled,
  isEdit,
}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      {contactInfo.email.active ? (
        <EmailInput disabled={inputDisabled} isEdit={isEdit} />
      ) : null}
      {contactInfo.telegram.active ? (
        <TelegramInput disabled={inputDisabled} isEdit={isEdit} />
      ) : null}
      <SlackInput disabled={inputDisabled} />
      {contactInfo?.discord?.active ? (
        <DiscordInput disabled={inputDisabled} />
      ) : null}
    </div>
  );
};
