'use client';

import {
  NotifiCardModal,
  NotifiCardModalProps,
} from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';

const NotifiComponentExample = () => {
  const copy: NotifiCardModalProps['copy'] = {
    Ftu: {
      FtuTargetEdit: {
        TargetInputs: {
          inputSeparators: {
            email: 'OR',
            sms: 'OR',
            telegram: 'OR',
          },
        },
      },
    },
    Inbox: {
      InboxConfigTargetEdit: {
        TargetInputs: {
          inputSeparators: {
            email: 'OR',
            sms: 'OR',
            telegram: 'OR',
          },
        },
      },
    },
  };
  return (
    <div className="notifi-card-modal-container">
      <NotifiCardModal darkMode copy={copy} />
    </div>
  );
};

export default NotifiComponentExample;
