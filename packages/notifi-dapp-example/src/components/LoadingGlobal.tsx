import { FC } from 'react';

// TODO: Take props ?
export const LoadingGlobal: FC = () => {
  return (
    <div className="fixed h-screen w-screen bg-opacity-80 bg-white">
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-b-transparent border-l-transparent border-sky-500"></div>
      </div>
    </div>
  );
};
