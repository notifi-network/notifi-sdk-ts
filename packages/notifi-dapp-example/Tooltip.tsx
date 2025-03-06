import { Icon } from '@/assets/Icon';
import React, { PropsWithChildren } from 'react';

export const Tooltip: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <button className="group flex items-center justify-center relative">
      <Icon id="info" style={{ color: '#B6B8D5' }} />
      <div className="w-[194px] bg-black text-white text-start border border-[#565A8D] text-sm font-medium rounded-md p-4 hidden absolute z-10 left-0 bottom-[102%] group-hover:block">
        {children}
      </div>
    </button>
  );
};
