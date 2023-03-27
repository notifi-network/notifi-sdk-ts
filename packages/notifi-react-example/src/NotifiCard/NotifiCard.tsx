import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiIntercomCard,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useMemo } from 'react';

import './NotifiCard.css';

// import './Pontem.css';

export const NotifiCard: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const hwLoginPlugin = useMemo(() => {
    return new MemoProgramHardwareLoginPlugin({
      walletPublicKey: publicKey ?? '',
      connection,
      sendTransaction,
    });
  }, [publicKey, connection, sendTransaction]);

  if (publicKey === null || signMessage === undefined) {
    // publicKey is required
    return null;
  }

  const inputLabels: NotifiInputFieldsText = {
    label: {
      email: 'Email',
      sms: 'Text Message',
      telegram: 'Telegram',
    },
    placeholderText: {
      email: 'Email',
    },
  };

  const inputSeparators: NotifiInputSeparators = {
    smsSeparator: {
      content: '',
    },
    emailSeparator: {
      content: '',
    },
  };

  const intercomInputSeparators: NotifiInputSeparators = {
    emailSeparator: {
      content: '',
    },
  };

  return (
    /**
     * Test dappAdresses/ subscription cardId / Intercom cardId:
     * junitest.xyz / b07f0267df1343db9d14757c653ec092 / 1045f61752b148eabab0403c08cd60b2
     */
    <div className="container">
      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="SOLANA"
        env="Development"
        walletPublicKey={publicKey}
        hardwareLoginPlugin={hwLoginPlugin}
        signMessage={signMessage}
      >
        NotifiSubscriptionCard
        <NotifiSubscriptionCard
          darkMode
          inputs={{ userWallet: publicKey }}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          cardId="b07f0267df1343db9d14757c653ec092"
          onClose={() => alert('nope you must stay')}
          copy={{
            FetchedStateCard: {
              SubscriptionCardV1: {
                signUpHeader: 'Please sign up',
                EditCard: {
                  AlertListPreview: {
                    description:
                      'Get your alerts here!!! you can subscribe to any of the following:',
                  },
                },
              },
            },
          }}
        />
        NotifiIntercomCard
        <NotifiIntercomCard
          darkMode
          inputLabels={inputLabels}
          inputSeparators={intercomInputSeparators}
          cardId="1045f61752b148eabab0403c08cd60b2"
        />
      </NotifiContext>

      <NotifiContext
        dappAddress=""
        env="Development"
        walletBlockchain="SOLANA"
        walletPublicKey="string"
        signMessage={async (msg: Uint8Array) => msg}
        hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        demoPreview={{ view: 'preview', data: JSON.parse(data) }}
      >
        Dummy Demo NotifiSubscriptionCard: Preview page
        <NotifiSubscriptionCard darkMode cardId="" />
      </NotifiContext>

      <NotifiContext
        dappAddress=""
        env="Development"
        walletBlockchain="SOLANA"
        walletPublicKey="string"
        signMessage={async (msg: Uint8Array) => msg}
        hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        demoPreview={{ view: 'edit', data: JSON.parse(data) }}
      >
        Dummy Demo NotifiSubscriptionCard: Edit page
        <NotifiSubscriptionCard darkMode cardId="" />
      </NotifiContext>

      <NotifiContext
        dappAddress=""
        env="Development"
        walletBlockchain="SOLANA"
        walletPublicKey="string"
        signMessage={async (msg: Uint8Array) => msg}
        hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        demoPreview={{ view: 'history', data: JSON.parse(data) }}
      >
        Dummy Demo NotifiSubscriptionCard: History page
        <NotifiSubscriptionCard darkMode cardId="" />
      </NotifiContext>

      <NotifiContext
        dappAddress=""
        env="Development"
        walletBlockchain="SOLANA"
        walletPublicKey="string"
        signMessage={async (msg: Uint8Array) => msg}
        hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        demoPreview={{ view: 'expired', data: JSON.parse(data) }}
      >
        Dummy Demo NotifiSubscriptionCard: Expired page
        <NotifiSubscriptionCard darkMode cardId="" />
      </NotifiContext>

      <NotifiContext
        dappAddress=""
        env="Development"
        walletBlockchain="SOLANA"
        walletPublicKey="string"
        signMessage={async (msg: Uint8Array) => msg}
        hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        demoPreview={{ view: 'verify', data: JSON.parse(data) }}
      >
        Dummy Demo NotifiSubscriptionCard: Verify page
        <NotifiSubscriptionCard darkMode cardId="" />
      </NotifiContext>
    </div>
  );
};

const data = `
{
  "version": "v1",
  "id": "51fd3e3da1104f15abe4e1f8df46747e",
  "name": "DemoSolana",
  "eventTypes": [
    {
      "name": "Test msg",
      "type": "broadcast",
      "broadcastId": {
        "type": "value",
        "value": "colorfullife__test"
      },
      "tooltipContent": "This is a test"
    },
    {
      "name": "announce",
      "type": "broadcast",
      "broadcastId": {
        "type": "value",
        "value": "colorfullife__announce"
      },
      "tooltipContent": "This is a announcement"
    },
    {
      "name": "balance",
      "type": "balanceChange",
      "tooltipContent": "Balance",
      "watchedWallets": {
        "type": "value",
        "value": [
          {
            "type": "Solana",
            "address": "G9on1ddvCc8xqfk2zMceky2GeSfVfhU8JqGHxNEWB5u4"
          },
          {
            "type": "Ethereum",
            "address": "0x1Fd455fDFD26962Fce5c694BD8028d64a5Ed6026"
          }
        ]
      }
    },
    {
      "name": "test#2",
      "type": "broadcast",
      "broadcastId": {
        "type": "value",
        "value": "colorfullife__test#2"
      },
      "tooltipContent": "test#2"
    },
    {
      "name": "customTest",
      "type": "custom",
      "filterType": "healthCheck",
      "numberType": "integer",
      "sourceType": "BENQI",
      "checkRatios": [
        {
          "type": "below",
          "ratio": 10
        },
        {
          "type": "below",
          "ratio": 20
        }
      ],
      "filterOptions": {},
      "sourceAddress": {
        "type": "value",
        "value": "0x1Fd455fDFD26962Fce5c694BD8028d64a5Ed6026"
      },
      "alertFrequency": "SINGLE",
      "selectedUIType": "HEALTH_CHECK",
      "tooltipContent": "customTest",
      "healthCheckSubtitle": "subtitle#1"
    },
    {
      "name": "directPush",
      "type": "directPush",
      "directPushId": {
        "type": "value",
        "value": "colorfullife__directPush"
      },
      "tooltipContent": "direct push test"
    },
    {
      "name": "priceChange",
      "type": "priceChange",
      "tokenIds": [
        "bitcoin",
        "ethereum",
        "aptos"
      ],
      "dataSource": "coingecko",
      "tooltipContent": "Get the price change for bitcoin/ ethereum and aptos"
    }
  ],
  "inputs": [],
  "contactInfo": {
    "sms": {
      "active": true,
      "supportedCountryCodes": [
        "+1",
        "+886"
      ]
    },
    "email": {
      "active": true
    },
    "telegram": {
      "active": true
    }
  }
}
`;
