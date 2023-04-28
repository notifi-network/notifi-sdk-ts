import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import './App.css';
import FrontendClient from './FrontendClient';
import { NotifiCard } from './NotifiCard/NotifiCard';
import WalletProviders from './walletProviders';

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li>
            <Link to="/">NotifiCard</Link>
          </li>
          <li>
            <Link to="/frontend">FrontendClient</Link>
          </li>
        </ul>
      </nav>
      <WalletProviders>
        <Routes>
          <Route path="/" element={<NotifiCard />} />
          <Route path="/frontend" element={<FrontendClient />} />
        </Routes>
      </WalletProviders>
    </div>
  );
}
export default App;
