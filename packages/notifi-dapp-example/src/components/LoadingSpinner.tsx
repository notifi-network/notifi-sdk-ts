import { FC } from 'react';

// TODO: Take props ?
export const LoadingSpinner: FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-32 w-32 border-4 border-b-transparent border-l-transparent border-sky-500"></div>
    </div>
  );
};
