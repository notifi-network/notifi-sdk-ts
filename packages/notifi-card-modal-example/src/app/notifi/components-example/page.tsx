'use client';

import {
  NotifiCardModal,
  NotifiCardModalProps,
  useNotifiHistoryContext,
} from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import Image from 'next/image';
import React from 'react';

const NotifiComponentExample = () => {
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  const { unreadCount, isLoading } = useNotifiHistoryContext();
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
  if (isLoading) return null;

  return (
    <div>
      <div style={{ position: 'relative', width: '50px', cursor: 'pointer' }}>
        <Image
          src="/bell.svg"
          alt="bell"
          width={50}
          height={50}
          onClick={() => setIsCardModalOpen((prev) => !prev)}
        />
        <div
          style={{
            backgroundColor: '#4B58EF',
            borderRadius: '100px',
            width: '20px',
            textAlign: 'center',
            color: 'white',
            position: 'absolute',
            top: '0',
            right: '0',
          }}
        >
          {unreadCount}
        </div>
      </div>

      {isCardModalOpen ? (
        <div className="notifi-card-modal-container">
          <NotifiCardModal darkMode copy={copy} />
        </div>
      ) : null}
    </div>
  );
};

export default NotifiComponentExample;
