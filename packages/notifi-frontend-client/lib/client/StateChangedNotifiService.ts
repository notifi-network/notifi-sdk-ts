import { Client } from 'graphql-ws';
import { NotifiSubscriptionClient } from './NotifiSubscriptionClient';
export const StateChangedNotifiService = (wsUrl: string, token: string | undefined, callback: () => void) => {

  const wsClient = NotifiSubscriptionClient(wsUrl, token, callback);
  const subscriptionQuery = `subscription {
    stateChanged {
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

  // (async () => {
  //   const query = wsClient.iterate({
  //     query: subscriptionQuery,
  //     extensions: {
  //       type: 'start'
  //     }

  //   });

  //   try {
  //     const value = await query.next();
  //     // if (callback) {
  //     //   callback();
  //     // }
  //     console.log('Data From ws:' + JSON.stringify(value));
  //     // complete
  //   } catch (err) {
  //     console.log("Error:" + JSON.stringify(err));
  //   }
  // })();
}
