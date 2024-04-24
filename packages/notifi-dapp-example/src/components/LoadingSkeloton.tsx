import React from 'react';

export const LoadingSkeloton = () => {
  return (
    <div>
      <div className="w-[6rem] h-[0.875rem] rounded-xl bg-gradient-gmx mb-2"></div>
      <div className="w-[20rem] h-[0.875rem] rounded-xl bg-gradient-gmx mb-10"></div>
    </div>
  );
};
