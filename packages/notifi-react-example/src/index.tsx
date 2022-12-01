import React from 'react';
import ReactDOM from 'react-dom';

import { SolanaWalletProvider } from './SolanaWalletProvider';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <SolanaWalletProvider>
      <App />
    </SolanaWalletProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
