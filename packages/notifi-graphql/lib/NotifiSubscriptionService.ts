import { createClient, Client } from 'graphql-ws';
export class NotifiSubscriptionService {
  private wsClient: Client | undefined;
  private jwt: string | undefined;
  constructor(private wsurl: string) {}

  disposeClient = () => {
    if (this.wsClient) {
      this.jwt = undefined;
      this.wsClient.terminate();
      this.wsClient.dispose();
    }
  };

  subscribe = (
    jwt: string | undefined,
    subscriptionQuery: string,
    onMessageReceived: (data: any) => void | undefined,
    onError?: (data: any) => void | undefined,
    onComplete?: () => void | undefined,
  ) => {
    this.jwt = jwt;
    this.initializeClientIfUndefined();
    this.wsClient?.subscribe(
      {
        query: subscriptionQuery,
        extensions: {
          type: 'start',
        },
      },
      {
        next: (data) => {
          if (onMessageReceived) {
            onMessageReceived(data);
          }
        },
        error: (error) => {
          if (onError && error instanceof Error) {
            onError(error);
          }
        },
        complete: () => {
          if (onComplete) {
            onComplete();
          }
        },
      },
    );
  };

  private initializeClientIfUndefined = () => {
    if (!this.wsClient) {
      this.initializeClient();
    }
  };

  private initializeClient = () => {
    this.wsClient = createClient({
      url: this.wsurl,
      connectionParams: {
        Authorization: `Bearer ${this.jwt}`,
      },
    });
  };
}
