import { Icon } from '@/assets/Icon';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import React, { useState } from 'react';

import { ConfigDestinationModal } from './ConfigDestinationModal';
import { UserDestinationsInfoPanel } from './UserDestinationsInfoPanel';

export const EditDestination = () => {
  const [open, setOpen] = useState(false);
  const { cardConfig } = useNotifiCardContext();

  return (
    <>
      <ConfigDestinationModal contactInfo={cardConfig.contactInfo} />
      <div className="flex flex-col items-center justify-center mt-9">
        <div className="flex flex-row items-center justify-between w-112 mb-6">
          <p className="text-xl">Destinations</p>
          <button
            className="rounded-lg text-notifi-text-light w-16 h-8 text-sm border border-solid border-gray-300 flex items-center justify-center flex-row"
            onClick={() => setOpen(true)}
          >
            <Icon id="edit-icon" className="w-5 mr-1" />
            <span className="mt-0.5">Edit</span>
          </button>
        </div>
        <UserDestinationsInfoPanel contactInfo={cardConfig.contactInfo} />
      </div>
    </>
  );
};
