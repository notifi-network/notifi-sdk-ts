import React from 'react';

export type AnimationType = 'spinner';

export const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-7 w-7 border-2 border-b-transparent border-l-transparent border-notifi-text"></div>
    </div>
  );
};
