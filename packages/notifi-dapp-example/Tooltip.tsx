import { Icon } from '@/assets/Icon';
import React, { PropsWithChildren } from 'react';

export const Tooltip: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative group">
      <Icon id="info" className="text-notifi-text-light" />
      <div className="text-notifi-text hidden group-hover:block absolute text-sm font-normal max-w-48 bg-notifi-card-bg p-4 rounded-md z-10 border border-notifi-card-border w-48 bottom-[1.5rem] right-[-5rem]">
        {children}
      </div>
    </div>
  );
};
