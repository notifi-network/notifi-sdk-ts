'use client';

import {
  NotifiCardModal,
  NotifiCardModalProps,
  useNotifiFrontendClientContext,
  useNotifiHistoryContext,
} from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const NotifiComponentExample = () => {
  const searchParams = useSearchParams();
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  const { unreadCount, isLoading } = useNotifiHistoryContext();
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const copy: NotifiCardModalProps['copy'] = {
    Ftu: {
      FtuTargetEdit: {
        TargetInputs: {
          inputSeparators: {
            email: 'OR',
            sms: 'OR',
            telegram: 'OR',
            discord: 'OR',
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
            discord: 'OR',
          },
        },
      },
    },
  };
  const bellIconHref = `/bell-${
    searchParams.get('scene') === 'light' ? 'light' : 'dark'
  }${isCardModalOpen ? '-open' : ''}.svg`;

  return (
    <div>
      <div>
        You can switch between tenants and some other params by adding arguments
        in URL:
        <ul>
          <li>
            tenantid, cardid and env: ex.
            "/notifi/components-example?tenant=your-tenant-id&cardid=your-card-id&env=Production"
          </li>
          <li>
            scene: ex. "/notifi/components-example?scene=light" (default is
            dark)
          </li>
        </ul>
      </div>
      <div style={{ position: 'relative', width: '50px', cursor: 'pointer' }}>
        <Image
          src={bellIconHref}
          alt={bellIconHref}
          style={{ border: '1px solid lightgray', borderRadius: '100px' }}
          width={50}
          height={50}
          onClick={() => setIsCardModalOpen((prev) => !prev)}
        />
        {frontendClientStatus.isAuthenticated ? (
          <div
            style={{
              backgroundColor: '#4B58EF',
              borderRadius: '100px',
              width: `${unreadCount < 10 ? '20px' : '25px'}`,
              textAlign: 'center',
              color: 'white',
              position: 'absolute',
              top: '0',
              right: '2px',
            }}
          >
            {unreadCount ? unreadCount : null}
          </div>
        ) : null}
      </div>

      {isCardModalOpen ? (
        <div className="notifi-card-modal-container">
          <NotifiCardModal
            darkMode={searchParams.get('scene') === 'light' ? false : true}
            copy={copy}
          />
        </div>
      ) : null}
    </div>
  );
};

export default NotifiComponentExample;
