import { NotifiSubscriptionClient } from './NotifiSubscriptionClient';
export const StateChangedNotifiService = (wsUrl: string, token: string | undefined, userid: string, callback: () => void) => {

  const wsClient = NotifiSubscriptionClient(wsUrl, token, callback);
  const subscriptionQuery = `subscription {
    stateChanged (stateChangedType:"${userid}_StateChanged") {
      __typename
    }
  }`;

  const subscription = wsClient.subscribe({
    query: subscriptionQuery,
    extensions: {
      type: 'start'
    }

  },
    {
      next: (data) => {
        if (callback) {
          callback();
        }
        console.log("Subscription data recieved" + JSON.stringify(data));
      },
      error: (error) => {
        console.error('Subscription error:', error);
      },
      complete: () => {
        console.log('Subscription completed');
      },
    });

  const onClose = () => {
    // subscription.unsubscribe();
  }
}