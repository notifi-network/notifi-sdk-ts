import { Icon } from '@/assets/Icon';
import { useNotifiTenantConfigContext } from '@notifi-network/notifi-react';
import React, { useState } from 'react';

import { DestinationPanel } from './DestinationPanel';
import { DestinationsEditModal } from './DestinationsEditModal';

export const DashboardDestinations = () => {
  const [open, setOpen] = useState(false);
  const { cardConfig } = useNotifiTenantConfigContext();

  const handleClick = () => {
    setOpen(true);
  };

  if (!cardConfig) {
    return null;
  }

  return (
    <>
      {open ? (
        <DestinationsEditModal
          contactInfo={cardConfig.contactInfo}
          setOpen={setOpen}
        />
      ) : null}
      <div className="flex flex-col items-center justify-start mt-9 h-[90vh] px-4">
        <div className="flex flex-row items-center justify-between w-full sm:w-112 mb-6">
          <p className="text-lg font-regular text-notifi-text">Destinations</p>
          <button
            className="rounded-lg text-notifi-text-light w-16 h-8 text-sm border border-solid border-notifi-card-border flex items-center justify-center flex-row"
            onClick={handleClick}
          >
            <Icon id="edit-icon" className="text-notifi-text-medium w-5 mr-1" />
            <span className="mt-0.5 text-notifi-text-medium">Edit</span>
          </button>
        </div>
        <DestinationPanel contactInfo={cardConfig.contactInfo} />
      </div>
    </>
  );
};
