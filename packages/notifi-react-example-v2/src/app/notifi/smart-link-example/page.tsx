'use client';

import { NotifiSmartLink } from '@notifi-network/notifi-react';
import '@notifi-network/notifi-react/dist/index.css';
import React from 'react';

export default function NotifiSmartLinkExample() {
  const [smartLinkId, setSmartLinkId] = React.useState<string>();
  return (
    <div>
      <input
        placeholder="Enter smart link id"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            setSmartLinkId(e.currentTarget.value);
          }
        }}
      />
      {smartLinkId ? (
        <NotifiSmartLink
          smartLinkId={smartLinkId}
          actionHandler={async (args) => {
            console.log('actionHandler', args);
          }}
        />
      ) : null}
    </div>
  );
}
