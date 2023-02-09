import React from 'react';
import ReactDOM from 'react-dom';

import { AcalaWalletContextProvider } from './AcalaWalletContextProvider';
import App from './App';
import { SolanaWalletProvider } from './SolanaWalletProvider';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AcalaWalletContextProvider>
      <SolanaWalletProvider>
        <App />
      </SolanaWalletProvider>
    </AcalaWalletContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
