'use client';

import { NotifiCardModal } from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';

const NotifiComponentExample = () => {
  console.log('NotifiComponentExample');
  return (
    <div className="notifi-card-modal-container">
      <NotifiCardModal darkMode />
    </div>
  );
};

export default NotifiComponentExample;
