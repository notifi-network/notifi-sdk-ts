import React from 'react';

import './App.css';
import { NotifiCard } from './NotifiCard/NotifiCard';
import { WalletConnectCard } from './NotifiCard/WalletConnectCard';

function App() {
  return (
    <div className="App">
      <NotifiCard />
      <WalletConnectCard />
    </div>
  );
}
export default App;
