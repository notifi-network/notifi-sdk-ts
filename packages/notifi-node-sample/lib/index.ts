import { FusionMessage } from '@notifi-network/notifi-dataplane';
import { NotifiNodeClient } from '@notifi-network/notifi-node';
import express, { Request } from 'express';

import { loggerMiddleWare } from './middleware/logger';
import {
  ServiceMiddleWareHttpBody,
  notifiAuthMiddleware,
  notifiServiceMiddleware,
} from './middleware/notifiService';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(loggerMiddleWare);
app.use(notifiServiceMiddleware);

const port = process.env.PORT || '8080';

app.get('/', (_req, res) => {
  return res.status(200).send(
    `
    <h2> 🚀 Notifi Node Sample API Server 🚀 </h2>
    <a href="https://docs.notifi.network/docs/getting-started-with-self-hosted#creating-your-node-js-server" target="_blank">Getting Started</a>
      <br/>
    <a href="https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node-sample#notifi-node-sample " target="_blank">Example API documentation</a>
    `,
  );
});

type LoginFromServiceHttpBody = {
  sid?: string;
  secret?: string;
};
app.post('/login', (req: Request<{}, {}, LoginFromServiceHttpBody>, res) => {
  const body = req.body ?? {};

  const sid = body.sid ?? process.env.NOTIFI_SID;
  const secret = body.secret ?? process.env.NOTIFI_SECRET;
  if (!sid || !secret) {
    return res.status(401).json({
      message: 'sid is required/ secret is required',
    });
  }

  const client = new NotifiNodeClient(
    res.locals.notifiService,
    res.locals.dpapiClient,
  );

  return client
    .logIn({ sid, secret })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof Error) {
        message = `notifi-node: login - ${e.message}`;
      }
      console.log('Error in login', message);
      return res.status(500).json({ message });
    });
});

type CreateTenantUserHttpBody = {
  walletBlockchain?: string;
  walletPublicKey?: string;
} & ServiceMiddleWareHttpBody;
app.post(
  '/create-tenant-user',
  notifiAuthMiddleware,
  (req: Request<{}, {}, CreateTenantUserHttpBody>, res) => {
    const jwt: string = res.locals.jwt;

    const { walletBlockchain, walletPublicKey } = req.body ?? {};

    if (!walletPublicKey || !walletBlockchain) {
      return res.status(400).json({
        message: 'walletPublicKey is required/ walletBlockchain is required',
      });
    }

    const client = new NotifiNodeClient(
      res.locals.notifiService,
      res.locals.dpapiClient,
    );

    client.initialize(jwt);

    return client
      .createTenantUser({
        walletBlockchain: walletBlockchain as WalletBlockchain, // ⬅ Ensure you input the correct value in request body: https://docs.notifi.network/notifi-sdk-ts/modules/_internal_.html#WalletBlockchain
        walletPublicKey,
      })
      .then((userId) => {
        return res.status(200).json({ userId });
      })
      .catch((e: unknown) => {
        let message = 'Unknown server error';
        if (e instanceof Error) {
          message = `notifi-node: createTenantUser - ${e.message}`;
        }

        return res.status(500).json({ message });
      });
  },
);

type GetActiveAlertsHttpBody = {
  first?: number;
  after?: string;
  fusionEventId: string;
} & ServiceMiddleWareHttpBody;
app.post(
  '/get-active-alerts',
  notifiAuthMiddleware,
  (req: Request<{}, {}, GetActiveAlertsHttpBody>, res) => {
    const jwt: string = res.locals.jwt;

    const { first, after, fusionEventId } = req.body ?? {};

    const client = new NotifiNodeClient(
      res.locals.notifiService,
      res.locals.dpapiClient,
    );

    client.initialize(jwt);

    if (!fusionEventId)
      return res
        .status(400)
        .json({ message: 'fusionEventIds is required in post body' });

    return client
      .getActiveAlerts({ first, after, fusionEventId })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((e: unknown) => {
        let message = 'Unknown server error';
        if (e instanceof Error) {
          message = e.message;
        }

        return res.status(500).json({ message });
      });
  },
);

type GetFusionNotificationHistoryHttpBody = {
  variables?: FusionMessage[];
} & ServiceMiddleWareHttpBody;

app.post(
  '/publish-fusion-message',
  notifiAuthMiddleware,
  (req: Request<{}, {}, GetFusionNotificationHistoryHttpBody>, res) => {
    const jwt: string = res.locals.jwt;

    if (!req.body.variables || !Array.isArray(req.body.variables))
      return res.status(400).json({
        message: 'variables field is required & must be an array',
      });
    const fusionMessages = (req.body.variables as unknown[]).filter(
      isFusionMessage,
    );

    const client = new NotifiNodeClient(
      res.locals.notifiService,
      res.locals.dpapiClient,
    );

    client.initialize(jwt);

    return client
      .publishFusionMessage(fusionMessages)
      .then((result) => {
        return res.status(200).json({ result });
      })
      .catch((e: unknown) => {
        let message = 'Unknown server error';
        if (e instanceof Error) {
          message = e.message;
        }

        return res.status(500).json({ message });
      });
  },
);

type SubscribeTenantActiveAlertChangedHttpBody = ServiceMiddleWareHttpBody;
let tenantActiveAlertChangedSubscription:
  | Awaited<ReturnType<NotifiNodeClient['addEventListener']>>
  | undefined = undefined;
// let webSocketClient: any;
app.post(
  '/subscribe-active-alert-changed-event',
  notifiAuthMiddleware,
  (_req: Request<{}, {}, SubscribeTenantActiveAlertChangedHttpBody>, res) => {
    if (tenantActiveAlertChangedSubscription)
      return res
        .status(200)
        .json({ message: 'already subscribed, unsubscribe before re-calling' });
    const client = new NotifiNodeClient(
      res.locals.notifiService,
      res.locals.dpapiClient,
    );

    client.initialize(res.locals.jwt);

    tenantActiveAlertChangedSubscription = client.addEventListener(
      'tenantActiveAlertChanged',
      (event) => {
        if (event.__typename === 'ActiveAlertCreatedEvent')
          console.log(
            `Active alert created, payload: $${JSON.stringify(event)}`,
          );
        if (event.__typename === 'ActiveAlertDeletedEvent')
          console.log(
            `Active alert deleted, payload: $${JSON.stringify(event)}`,
          );
        // Do something with the event
      },
    );

    // NOTE: Add event listeners to monitor websocket connection status (You can also remove event listeners using removeEventListener method)
    // client.addEventListener('wsConnecting', () => {
    //   console.log('notifi-node: Websocket connecting');
    // });
    // client.addEventListener('wsConnected', (wsClient) => {
    //   console.log('notifi-node: Websocket connected', wsClient);
    //   webSocketClient = wsClient;
    // });
    // client.addEventListener('wsClosed', (closeEvent) => {
    //   console.log('notifi-node: Websocket closed');
    //   // Do something to when the websocket is closed. Ex, remove event listeners.
    // });
    // client.addEventListener('wsError', (err) => {
    //   console.log('notifi-node: Websocket error', err);
    //   // Do something to handle the error
    // });

    if (tenantActiveAlertChangedSubscription) {
      return res.status(200).json({
        message: 'notifi-node: subscribeTenantActiveAlertChanged - subscribed',
      });
    }
  },
);

type UnsubscribeTenantActiveAlertChangedHttpBody = ServiceMiddleWareHttpBody;
app.post(
  '/unsubscribe-tenant-active-alert-changed-event',
  notifiAuthMiddleware,
  (_req: Request<{}, {}, UnsubscribeTenantActiveAlertChangedHttpBody>, res) => {
    if (tenantActiveAlertChangedSubscription) {
      try {
        // webSocketClient.terminate();
        tenantActiveAlertChangedSubscription.subscription?.unsubscribe();

        // webSocketClient.dispose(); // NOTE: Somehow unsubscribe cannot close the websocket connection sometimes, so we manually close it (we can also use .terminate method to close immediately)

        // webSocketClient = null;
        const client = new NotifiNodeClient(
          res.locals.notifiService,
          res.locals.dpapiClient,
        );
        client.initialize(res.locals.jwt);
        client.removeEventListener(
          'tenantActiveAlertChanged',
          tenantActiveAlertChangedSubscription.id,
        );
        tenantActiveAlertChangedSubscription = undefined;
        return res.status(200).json({
          message:
            'notifi-node: unsubscribeTenantActiveAlertChanged - unsubscribed',
        });
      } catch (e: unknown) {
        let message = 'Unknown server error';
        if (e instanceof Error) {
          message = e.message;
        }
        return res.status(500).json({ message });
      }
    }
    return res.status(200).json({
      message:
        'notifi-node: unsubscribeTenantActiveAlertChanged - no tenant active alert updated subscription',
    });
  },
);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

// Utils
const isFusionMessage = (message: unknown): message is FusionMessage => {
  if (!message || typeof message !== 'object') return false;
  const keys = Object.keys(message);
  if (!keys.includes('eventTypeId') || !keys.includes('variablesJson'))
    return false;
  return true;
};

// NOTE: we could import it form `notifi-graphql` package. But for performance concerns and better practice (not to install extra package just for type), we extract the WalletBlockchain type manually
type WalletBlockchain = (NotifiNodeClient['createTenantUser'] extends (
  arg: infer T,
) => any
  ? T
  : never)['walletBlockchain'];
