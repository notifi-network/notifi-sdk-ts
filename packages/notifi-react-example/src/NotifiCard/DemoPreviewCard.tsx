import {
  NotifiContext,
  NotifiDemoPreviewContextProvider,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';

export const DemoPrviewCard = () => {
  return (
    <div>
      <h1>Notifi Card: Dummy Demo</h1>
      Dummy Demo NotifiSubscriptionCard: Preview page
      <NotifiDemoPreviewContextProvider view="preview" data={JSON.parse(data)}>
        <NotifiContext
          dappAddress=""
          env="Development"
          walletBlockchain="SOLANA"
          walletPublicKey="string"
          signMessage={async (msg: Uint8Array) => msg}
          hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        >
          <NotifiSubscriptionCard darkMode cardId="" />
        </NotifiContext>
      </NotifiDemoPreviewContextProvider>
      Dummy Demo NotifiSubscriptionCard: Edit page
      <NotifiDemoPreviewContextProvider view="edit" data={JSON.parse(data)}>
        <NotifiContext
          dappAddress=""
          env="Development"
          walletBlockchain="SOLANA"
          walletPublicKey="string"
          signMessage={async (msg: Uint8Array) => msg}
          hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        >
          <NotifiSubscriptionCard darkMode cardId="" />
        </NotifiContext>
      </NotifiDemoPreviewContextProvider>
      Dummy Demo NotifiSubscriptionCard: History page
      <NotifiDemoPreviewContextProvider view="history" data={JSON.parse(data)}>
        <NotifiContext
          dappAddress=""
          env="Development"
          walletBlockchain="SOLANA"
          walletPublicKey="string"
          signMessage={async (msg: Uint8Array) => msg}
          hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        >
          <NotifiSubscriptionCard darkMode cardId="" />
        </NotifiContext>
      </NotifiDemoPreviewContextProvider>
      Dummy Demo NotifiSubscriptionCard: Expired page
      <NotifiDemoPreviewContextProvider view="expired" data={JSON.parse(data)}>
        <NotifiContext
          dappAddress=""
          env="Development"
          walletBlockchain="SOLANA"
          walletPublicKey="string"
          signMessage={async (msg: Uint8Array) => msg}
          hardwareLoginPlugin={{ sendMessage: async (msg: string) => msg }}
        >
          <NotifiSubscriptionCard darkMode cardId="" />
        </NotifiContext>
      </NotifiDemoPreviewContextProvider>
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
      "type": "fusion",
      "name": "Fusion Toggle",
      "tooltipContent": "This is Fusion Toggle alerts",
      "selectedUIType": "TOGGLE",
      "fusionEventId": {
        "type": "value",
        "value": "fusionEventId"
      },
      "sourceAddress": {
        "type": "value",
        "value": "fusionSourceAddress"
      },
      "useCustomIcon": false
    },
    {
      "name": "Fusion Health Alerts",
      "selectedUIType": "HEALTH_CHECK",
      "type": "fusion",
      "tooltipContent": "This is Fusion Health alerts",
      "fusionEventId": {
        "type": "value",
        "value": "fusionEventId"
      },
      "sourceAddress": {
        "type": "value",
        "value": "fusionSourceAddress"
      },
      "useCustomIcon": false,
      "healthCheckSubtitle": "Fusion Health Alerts Subtitle",
      "numberType": "percentage",
      "alertFrequency": "SINGLE",
      "checkRatios": [
        {
          "type": "below",
          "ratio": 5
        },
        {
          "type": "below",
          "ratio": 10
        }
      ]
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
