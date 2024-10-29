import { FusionMessage } from '@notifi-network/notifi-dataplane';
import {
  NotifiClient,
  NotifiEnvironment,
  NotifiNodeClient,
  createDataplaneClient,
  createGraphQLClient,
  createNotifiService,
  createNotifiSubscriptionService,
} from '@notifi-network/notifi-node';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import json from 'morgan-json';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

const format = json({
  short: ':method :url :status',
  length: ':res[content-length]',
  'response-time': ':response-time ms',
});

app.use(morgan(format));

const port = process.env.PORT || '8080';

app.get('/', (_req, res) => {
  return res.status(200).json({
    hello: 'world',
  });
});

const parseEnv = (envString: string | undefined): NotifiEnvironment => {
  const str = envString ?? process.env.NOTIFI_ENV;
  let notifiEnv: NotifiEnvironment = 'Production';
  if (
    str === 'Production' ||
    str === 'Staging' ||
    str === 'Development' ||
    str === 'Local'
  ) {
    notifiEnv = str;
  }

  return notifiEnv;
};

const notifiServiceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body: Readonly<{
    env?: string;
  }> = req.body ?? {};
  const notifiEnv = parseEnv(body.env);
  const graphqlClient = createGraphQLClient(notifiEnv);
  const dpapiClient = createDataplaneClient(notifiEnv);
  const subService = createNotifiSubscriptionService(notifiEnv);
  const notifiService = createNotifiService(graphqlClient, subService);
  res.locals.notifiService = notifiService;
  res.locals.dpapiClient = dpapiClient;
  next();
};

app.use(notifiServiceMiddleware);

app.post('/login', (req, res) => {
  const body: Readonly<{
    sid?: string;
    secret?: string;
  }> = req.body ?? {};

  const sid = body.sid ?? process.env.NOTIFI_SID;
  if (sid === undefined || sid === '') {
    return res.status(401).json({
      message: 'sid is required',
    });
  }

  const secret = body.secret ?? process.env.NOTIFI_SECRET;
  if (secret === undefined || secret === '') {
    return res.status(401).json({
      message: 'secret is required',
    });
  }

  const client = new NotifiClient(
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

const authorizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  if (authorization === undefined) {
    return res.status(401).json({
      message: 'Authorization is required',
    });
  }

  let jwt = '';
  if (authorization.startsWith('Bearer ')) {
    const tokens = authorization.split(' ');
    if (tokens.length > 1) {
      jwt = tokens[1];
    }
  }

  if (jwt === '') {
    return res.status(401).json({
      message: 'Bearer token is required',
    });
  }

  res.locals.jwt = jwt;
  next();
};

app.post('/createTenantUser', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    walletBlockchain,
    walletPublicKey,
  }: Readonly<{
    walletBlockchain?: string;
    walletPublicKey?: string;
  }> = req.body ?? {};

  if (walletPublicKey === undefined) {
    return res.status(400).json({
      message: 'walletPublicKey is required',
    });
  }

  if (walletBlockchain === undefined) {
    return res.status(400).json({
      message: 'walletBlockchain is required',
    });
  } else if (walletBlockchain !== 'SOLANA' && walletBlockchain !== 'NEAR') {
    return res.status(400).json({
      message: 'Unsupported walletBlockchain',
    });
  }

  const client = new NotifiClient(
    res.locals.notifiService,
    res.locals.dpapiClient,
  );

  client.initialize(jwt);

  return client
    .createTenantUser({
      walletBlockchain,
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
});

app.post('/publishFusionMessage', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    variables,
  }: Readonly<{
    /**
     * @param FusionMessage.variablesJson - Variables for template rendering. For instance, `fromAddress` can be displayed with `{{ eventData.fromAddress }}`.
     * FusionMessage's generic type parameter defines the type of variablesJson. Defaults to CommunityManagerJsonPayload for Community Manager post templates if not provided.
     */
    variables?: Readonly<FusionMessage[]>;
  }> = req.body ?? {};

  if (!variables) {
    return res.status(400).json({
      message: 'messages is required',
    });
  }

  const client = new NotifiClient(
    res.locals.notifiService,
    res.locals.dpapiClient,
  );

  client.initialize(jwt);

  return client
    .publishFusionMessage(variables)
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
});

let tenantEntityChangedSubscription: NonNullable<
  Awaited<ReturnType<NotifiNodeClient['subscribeTenantEntityUpdated']>>
> | null = null;
let webSocketClient: any;
app.get('/subscribeTenantEntityChanged', authorizeMiddleware, (_req, res) => {
  if (tenantEntityChangedSubscription)
    return res
      .status(200)
      .json({ message: 'already subscribed, unsubscribe before re-calling' });
  const client = new NotifiClient(
    res.locals.notifiService,
    res.locals.dpapiClient,
  );

  client.initialize(res.locals.jwt);

  // NOTE: Add event listeners to monitor websocket connection status (You can also remove event listeners using removeEventListener method)
  client.addEventListener('wsConnecting', () => {
    console.log('notifi-node: Websocket connecting');
  });
  client.addEventListener('wsConnected', (wsClient) => {
    console.log('notifi-node: Websocket connected', wsClient);
    webSocketClient = wsClient;
  });
  client.addEventListener('wsClosed', (closeEvent) => {
    console.log('notifi-node: Websocket closed');
    // Do something to when the websocket is closed. Ex, remove event listeners.
  });
  client.addEventListener('wsError', (err) => {
    console.log('notifi-node: Websocket error', err);
    // Do something to handle the error
  });

  client
    .subscribeTenantEntityUpdated(
      (event) => {
        console.log(`Tenant entity updated: ${JSON.stringify(event)}`);
        // Do something with the event
      },
      (err) => {
        console.log(`Error in tenant entity updated: ${err}`);
        res.status(500).json({ message: err.message });
      },
      () => {
        console.log('Subscription completed');
        res.status(200).json({ message: 'completed' });
      },
    )
    .then((sub) => {
      tenantEntityChangedSubscription = sub;
      console.log('subscribed', tenantEntityChangedSubscription);
      res.status(200).json({
        message: 'notifi-node: subscribeTanatEntityChanged - subscribed',
      });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof Error) {
        message = e.message;
      }
      return res.status(500).json({ message });
    });
});

app.get(
  '/unsubscribe-tenant-entity-change-event',
  authorizeMiddleware,
  (_req, res) => {
    if (tenantEntityChangedSubscription) {
      try {
        // webSocketClient.terminate();
        tenantEntityChangedSubscription.unsubscribe();
        webSocketClient.dispose(); // NOTE: Somehow unsubscribe cannot close the websocket connection sometimes, so we manually close it (we can also use .terminate method to close immediately)
        tenantEntityChangedSubscription = null;
        webSocketClient = null;

        return res.status(200).json({
          message: 'notifi-node: unsubscribeTenantEntityChanged - unsubscribed',
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
        'notifi-node: unsubscribeTenantEntityChanged - no tenant entity updated subscription',
    });
  },
);

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
