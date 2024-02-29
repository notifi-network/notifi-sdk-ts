import { Icon } from '@/assets/Icon';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { useNotifiTargets } from '@/hooks/useNotifiTargets';
import {
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React, { useCallback, useState } from 'react';

import { DestinationPanel } from './DestinationPanel';
import { DestinationsEditModal } from './DestinationsEditModal';

export const DashboardDestinations = () => {
  const [open, setOpen] = useState(false);
  const { cardConfig } = useNotifiCardContext();

  const { email, phoneNumber, telegramId } = useNotifiSubscriptionContext();
  const { setHasEmailChanges, setHasTelegramChanges } = useNotifiTargets();

  const {
    setEmail,
    setTelegram,
    setPhoneNumber,
    setEmailErrorMessage,
    setTelegramErrorMessage,
    setPhoneNumberErrorMessage,
  } = useNotifiForm();

  const resetFormState = useCallback(() => {
    setEmail(email);
    setPhoneNumber(phoneNumber);
    setTelegram(telegramId);
    setEmailErrorMessage('');
    setTelegramErrorMessage('');
    setPhoneNumberErrorMessage('');
    setHasEmailChanges(false);
    setHasTelegramChanges(false);
  }, [email, phoneNumber, telegramId]);

  const handleClick = () => {
    resetFormState();
    setOpen(true);
  };

  return (
    <>
      {open ? (
        <DestinationsEditModal
          contactInfo={cardConfig.contactInfo}
          setOpen={setOpen}
        />
      ) : null}
      <div className="flex flex-col items-center justify-center mt-9">
        <div className="flex flex-row items-center justify-between w-112 mb-6">
          <p className="text-xl">Destinations</p>
          <button
            className="rounded-lg text-notifi-text-light w-16 h-8 text-sm border border-solid border-gray-300 flex items-center justify-center flex-row"
            onClick={handleClick}
          >
            <Icon id="edit-icon" className="text-notifi-text-light w-5 mr-1" />
            <span className="mt-0.5">Edit</span>
          </button>
        </div>
        <DestinationPanel contactInfo={cardConfig.contactInfo} />
      </div>
    </>
  );
};
