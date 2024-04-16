import { createClient, Client } from 'graphql-ws';

export const NotifiSubscriptionClient = (url: string, jwt: string | undefined, callback = () => { }) => {

  const client: Client = createClient({
    url: url,
    connectionParams: {
      Authorization: `Bearer ${jwt}`,
    },
  });

  client.on('connected', () => {
    console.log('WebSocket connection opened');
  });

  client.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  client.on('message', (data) => {
    if (data.type == 'next') {
      if (callback) {
        callback();
      }
    }
    console.log('Received data:', data);
  });

  return client;
}
