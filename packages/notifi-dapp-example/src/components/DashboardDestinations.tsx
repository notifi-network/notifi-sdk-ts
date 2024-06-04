import { Icon } from '@/assets/Icon';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { useNotifiTargetListener } from '@/hooks/useNotifiTargetListener';
import React, { useState } from 'react';

import { DestinationPanel } from './DestinationPanel';
import { DestinationsEditModal } from './DestinationsEditModal';

export const DashboardDestinations = () => {
  useNotifiTargetListener();
  const [open, setOpen] = useState(false);
  const { cardConfig } = useNotifiTenantConfig();

  const handleClick = () => {
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
      <div className="flex flex-col items-center justify-start mt-9 h-[90vh] px-4 relative">
        <div className="flex flex-row items-center justify-between w-full sm:w-112 mb-6">
          <p className="text-lg font-regular">Destinations</p>
          <button
            className="rounded-lg text-notifi-text-light w-16 h-8 text-sm border border-solid border-gray-300 flex items-center justify-center flex-row"
            onClick={handleClick}
          >
            <Icon id="edit-icon" className="text-notifi-text-light w-5 mr-1" />
            <span className="mt-0.5">Edit</span>
          </button>
        </div>
        <DestinationPanel contactInfo={cardConfig.contactInfo} />
        <div className="text-xs w-full sm:w-[460px] italic font-regular absolute bottom-12 sm:ml-0 ml-2">
          By choosing to receive Injective Notifications, you agree to hold the
          Injective Foundation and its affiliates harmless for any claims
          related to the Notifications.
        </div>
      </div>
    </>
  );
};
