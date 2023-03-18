import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

import { AcalaWalletContextProvider } from './AcalaWalletContextProvider';
import App from './App';
import { SolanaWalletProvider } from './SolanaWalletProvider';
import './index.css';

const container = document.getElementById('root');
if (container != null) {
  const root = ReactDOMClient.createRoot(container);
  root.render(
    <React.StrictMode>
      <AcalaWalletContextProvider>
        <SolanaWalletProvider>
          <App />
        </SolanaWalletProvider>
      </AcalaWalletContextProvider>
    </React.StrictMode>,
  );
}
