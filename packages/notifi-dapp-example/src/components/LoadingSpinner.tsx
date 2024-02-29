import { FC } from 'react';

// TODO: Take props ?
export const LoadingSpinner: FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-28 w-28 border-4 border-b-transparent border-l-transparent border-notifi-primary-text"></div>
    </div>
  );
};
