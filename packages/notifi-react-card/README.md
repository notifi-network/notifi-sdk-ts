# `@notifi-network/notifi-react-card`

> Configurable component for Notifi alerts

## Usage

```
npm install @notifi-network/notifi-react-card
npm install --save-dev @notifi-network/notifi-core
```

### Create a component which controls Alert configuration

```tsx
import type { AlertConfiguration } from '@notifi-network/notifi-react-card';
import {
  broadcastMessageConfiguration,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React, { useEffect, useState } from 'react';

const ALERT_NAME = 'My Marketing Updates';
const ALERT_CONFIGURATION: AlertConfiguration = broadcastMessageConfiguration({
  topicName: `TALK_TO_NOTIFI_TO_GET_THIS_VALUE`,
});

type Props = Readonly<{
  disabled: boolean;
}>;

export const MarketingToggle: React.FC<Props> = ({ disabled }: Props) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const { setAlertConfiguration } = useNotifiSubscriptionContext();

  useEffect(() => {
    if (enabled) {
      setAlertConfiguration(ALERT_NAME, ALERT_CONFIGURATION);
    } else {
      setAlertConfiguration(ALERT_NAME, null);
    }
  }, [enabled]);

  return (
    <div>
      <span>Sign up for Marketing alerts</span>
      <input
        disabled={disabled}
        type="checkbox"
        checked={enabled}
        onChange={(e) => {
          setEnabled(e.target.checked);
        }}
      />
    </div>
  );
};
```

### Create a wrapper for the contents of the card

```tsx
import { MarketingToggle } from './MarketingToggle';
import {
  NotifiEmailInput,
  NotifiFooter,
  NotifiSmsInput,
  useNotifiSubscribe,
} from '@notifi-network/notifi-react-card';
import React from 'react';

export const NotifiCardContents: React.FC = () => {
  const { loading, subscribe } = useNotifiSubscribe();

  return (
    <>
      <NotifiEmailInput disabled={loading} />
      <NotifiSmsInput disabled={loading} />
      <MarketingToggle disabled={loading} />
      <button
        disabled={loading}
        type="submit"
        onClick={async () => {
          await subscribe();
        }}
      >
        Subscribe
      </button>
      <NotifiFooter />
    </>
  );
};
```

### Render the Card in your app

```tsx
import { NotifiCardContents } from './NotifiCardContents';
import type { MessageSigner } from '@notifi-network/notifi-core';
import { NotifiCard } from '@notifi-network/notifi-react-card';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

export const Notifi: React.FC = () => {
  const { wallet } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  return (
    <NotifiCard
      dappAddress="TALK_TO_NOTIFI"
      env="Development"
      signer={adapter as MessageSigner}
      walletPublicKey={publicKey}
    >
      <NotifiCardContents />
    </NotifiCard>
  );
};
```
