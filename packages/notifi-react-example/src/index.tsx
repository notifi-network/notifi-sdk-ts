import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { SolanaWalletProvider } from './SolanaWalletProvider';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SolanaWalletProvider>
      <App />
    </SolanaWalletProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
