import { Icon } from '@/assets/Icon';
import { CardConfigItemV1 } from '@notifi-network/notifi-react-card';
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
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="fixed inset-0 bg-black bg-opacity-20 z-0"> </div>
      <div className="h-4/6 w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container relative">
        <div>
          <div
            className="cursor-pointer absolute top-8 right-8"
            onClick={() => setOpen(false)}
          >
            <Icon id="close-icon" className="text-notifi-text-light" />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-xl mt-12">Edit Destinations</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm opacity-50 font-semibold my-4">
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
