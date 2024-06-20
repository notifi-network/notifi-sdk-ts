import { Icon } from '@/assets/Icon';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { InputFields } from './InputFields';

export type DestinationsEditModalProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const DestinationsEditModal: React.FC<DestinationsEditModalProps> = ({
  contactInfo,
  setOpen,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50"> </div>
      <div className="h-3/4 md:h-4/6 w-full md:w-4/6 bg-notifi-destination-card-bg z-50 rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container relative px-4 border border-notifi-card-border">
        <div className="w-full">
          <div
            className="cursor-pointer absolute top-8 right-8"
            onClick={() => setOpen(false)}
          >
            <Icon id="close-icon" className="text-notifi-text-light" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl mt-12 text-notifi-text">Edit Destinations</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm opacity-50 font-semibold my-4 text-notifi-text-light">
              A minimum of one destination is required
            </p>
            <InputFields
              contactInfo={contactInfo}
              inputDisabled={false}
              isEditable={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
