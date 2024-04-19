import { createClient, Client } from 'graphql-ws';
export class NotifiSubscriptionService {
  private wsClient: Client | undefined;
  private retryCount = 0;
  private jwt: string | undefined;
  constructor(private wsurl: string) {
  }

  disposeClient = () => {
    if (this.wsClient) {
      this.jwt = undefined;
      this.wsClient.terminate();
      this.wsClient.dispose();
    }
  };

  subscribe = (jwt: string | undefined, subscriptionQuery: string, onMessageReceived: (data: any) => void | undefined, onError?: (data: any) => void | undefined, onComplete?: () => void | undefined) => {
    this.jwt = jwt;
    this.initializeClientIfUndefined();
    this.wsClient?.subscribe({
      query: subscriptionQuery,
      extensions: {
        type: 'start'
      }
    },
      {
        next: (data) => {
          if (onMessageReceived) {
            onMessageReceived(data);
          }
        },
        error: (error) => {
          if (onError) {
            onError(error);
          }
        },
        complete: () => {
          if (onComplete) {
            onComplete();
          }
        },
      })
  }

  private initializeClientIfUndefined = () => {
    if (!this.wsClient) {
      this.initializeClient();
    }
  }

  private initializeClient = () => {
    //transport
    this.wsClient = createClient({
      url: this.wsurl,
      connectionParams: {
        Authorization: `Bearer ${this.jwt}`,
      },
      lazyCloseTimeout: 3000,
      disablePong: true
    });

    this.wsClient.on('connected', () => {
      this.wsStatus = 'Connected';
    });

    this.wsClient.on('error', (error) => {
      this.wsStatus = 'Failed';
    });

    this.wsClient.on('closed', () => {
      
    });
  }

  private handleOnError() {
    this.wsClient?.terminate();
    this.wsClient?.dispose();
    this.initializeClient()
  }

  public onRetry() {
    if (this.retryCount < 3) {
      setTimeout(() => {
        this.handleOnError();
        this.retryCount++;
        if (this.wsStatus !== 'Connected' && this.retryCount < 3) {
          this.onRetry();
        }
      }, 3000);
    } else {
      if (this.retryCount >= 3 && this.wsStatus !== 'Connected') {
        console.log('Not able to connect, please contact to admin...');
      }
    }
  }
}

export const SubscriptionQueries = {
  StateChanged: `subscription {
    stateChanged {
      __typename
    }
  }`
}
