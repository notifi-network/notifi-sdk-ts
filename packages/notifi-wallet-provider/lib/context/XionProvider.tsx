import { AbstraxionProvider } from '@burnt-labs/abstraxion';
import React, { PropsWithChildren } from 'react';

const contractsAddress =
  'xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka'; //TODO: make it dynamic

export const XionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AbstraxionProvider
      config={{
        contracts: [contractsAddress],
      }}
    >
      {children}
    </AbstraxionProvider>
  );
};
