import { createClient, Client } from 'graphql-ws';
export class NotifiSubscriptionService {
  public wsClient: Client | undefined;
  constructor(private wsurl: string) {
  }

  disposeClient = () => {
    if (this.wsClient) {
      this.wsClient.terminate();
      this.wsClient.dispose();
    }
  };

  subscribe = (jwt: string | undefined, subscriptionQuery: string, actionOnMessageReceived: () => void | undefined) => {
    this.initializeClientIfUndefined(jwt);
    this.wsClient?.subscribe({
      query: subscriptionQuery,
      extensions: {
        type: 'start'
      }
    },
      {
        next: (data) => {
          if (actionOnMessageReceived) {
            actionOnMessageReceived();
          }
          console.log("Subscription data recieved" + JSON.stringify(data));
        },
        error: (error) => {
          console.error('Subscription error:', error);
        },
        complete: () => {
          console.log('Subscription completed');
        },
      })
  }

  private initializeClientIfUndefined = (jwt: string | undefined) => {
    if (!this.wsClient) {
      this.initializeClient(jwt);
    }
  }

  private initializeClient = (jwt: string | undefined) => {
    this.wsClient = createClient({
      url: this.wsurl,
      connectionParams: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    this.wsClient.on('connected', () => {
      console.log('WebSocket connection opened');
    });

    this.wsClient.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.wsClient.on('closed', (event) => {
      setTimeout(() => {
        // this.ensureWebsocketProviderSetup();
      }, 3000);
    });

    this.wsClient.on('message', (data) => {
      if (data.type == 'next') {
        console.log('Notification history has been changed: ', data);
      } else {
        console.log('Received data:', data);
      }
    });
  }
}

export const SubscriptionQueries = {
  StateChanged: `subscription {
    stateChanged {
      __typename
    }
  }`
}
