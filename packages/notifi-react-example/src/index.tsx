import React from 'react';
import ReactDOM from 'react-dom';

import { SolanaWalletProvider } from './SolanaWalletProvider';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <SolanaWalletProvider />
  </React.StrictMode>,
  document.getElementById('root'),
);
