import React from 'react';

export const LoadingSkeloton = () => {
  return (
    <div>
      <div className="w-[6rem] h-[0.875rem] rounded-xl bg-black opacity-5 mb-2"></div>
      <div className="w-[20rem] h-[0.875rem] rounded-xl bg-black opacity-5 mb-10"></div>
    </div>
  );
};
