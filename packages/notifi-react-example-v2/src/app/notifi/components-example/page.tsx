'use client';

import { useSignTransaction } from '@/hooks/useSignTransaction';
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
  const { unreadCount } = useNotifiHistoryContext();
  const { frontendClientStatus, loginViaTransaction } =
    useNotifiFrontendClientContext();
  const {
    isLoading,
    signTransaction,
    isSupported: isSignTxSupported,
  } = useSignTransaction();
  const copy: NotifiCardModalProps['copy'] = {
    /* ⬇ Uncomment below to enable footer content */
    // Connect: {
    //   footerContent: [
    //     {
    //       type: 'plain-text',
    //       text: 'This is an example of some footer content that may link to a ',
    //     },
    //     {
    //       type: 'hyperlink',
    //       text: 'privacy policy',
    //       url: 'https://notifi.network',
    //     },
    //     { type: 'plain-text', text: ' and ' },
    //     {
    //       type: 'hyperlink',
    //       text: 'terms of service',
    //       url: 'https://notifi.network',
    //     },
    //   ],
    // },
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
      // TODO: Update associated docs
      // InboxDiscover: {
      //   src: 'https://docs.notifi.network/docs/next',
      // },
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
      {isSignTxSupported &&
      !frontendClientStatus.isAuthenticated &&
      loginViaTransaction ? (
        <>
          {isLoading ? (
            <div className="loading-solana-tx">Loading ... (tx in process)</div>
          ) : (
            <button onClick={signTransaction}>Sign dummy transaction</button>
          )}
        </>
      ) : null}

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
            // TODO: Update associated docs
            // isDiscoverViewEnabled
          />
        </div>
      ) : null}
    </div>
  );
};

export default NotifiComponentExample;
