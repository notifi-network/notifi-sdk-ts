import { useNotifiTenantConfigContext } from '@notifi-network/notifi-react';
import React from 'react';

import { TargetList } from './TargetList';

export const DashboardDestinations = () => {
  const { cardConfig } = useNotifiTenantConfigContext();

  if (!cardConfig) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-start mt-9 h-[90vh] px-4">
        <div className="flex flex-row items-center justify-center w-full sm:w-112 mb-6">
          <p className="text-lg font-regular text-notifi-text">Destinations</p>
        </div>
        <TargetList contactInfo={cardConfig.contactInfo} />
      </div>
    </>
  );
};
