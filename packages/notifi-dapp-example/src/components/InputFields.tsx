import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { InputFieldDiscord } from './InputFieldDiscord';
import { InputFieldEmail } from './InputFieldEmail';
import { InputFieldTelegram } from './InputFieldTelegram';
import { InputFieldWallet } from './InputFieldWallet';

export type InputFieldsProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  inputDisabled: boolean;
  isEditable?: boolean;
};
export const InputFields: React.FC<InputFieldsProps> = ({
  contactInfo,
  inputDisabled,
  isEditable,
}) => {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      {contactInfo.email.active ? (
        <InputFieldEmail disabled={inputDisabled} isEditable={isEditable} />
      ) : null}
      {contactInfo.telegram.active ? (
        <InputFieldTelegram disabled={inputDisabled} isEditable={isEditable} />
      ) : null}
      {/* <InputFieldSlack disabled={inputDisabled} isEditable={isEditable} /> */}
      {contactInfo?.discord?.active ? (
        <InputFieldDiscord disabled={inputDisabled} isEditable={isEditable} />
      ) : null}
      <InputFieldWallet disabled={inputDisabled} isEditable={isEditable} />
    </div>
  );
};
