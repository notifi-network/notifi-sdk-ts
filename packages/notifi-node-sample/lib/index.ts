import { FusionMessage } from '@notifi-network/notifi-dataplane';
import { NotifiNodeClient } from '@notifi-network/notifi-node';
import express, { Request, Response } from 'express';

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

let client: NotifiNodeClient | undefined = undefined;

type LoginFromServiceHttpBody = {
  sid?: string;
  secret?: string;
};
app.post(
  '/login',
  (req: Request<object, object, LoginFromServiceHttpBody>, res) => {
    const body = req.body ?? {};

    const sid = body.sid ?? process.env.NOTIFI_SID;
    const secret = body.secret ?? process.env.NOTIFI_SECRET;
    if (!sid || !secret) {
      return res.status(401).json({
        message: 'sid is required/ secret is required',
      });
    }

    client = res.locals.client;

    if (!client) {
      return res.status(500).json({
        message: 'notifi-node: login - failed to initialize client',
      });
    }

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
        console.error('Error in login', message);
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
  (req: Request<object, object, GetActiveAlertsHttpBody>, res: Response) => {
    if (!client && !!res.locals.client) {
      client = res.locals.client;
      client?.initialize(res.locals.jwt);
    }

    if (!client || client.status.status === 'uninitialized') {
      return res.status(400).json({
        message:
          '/get-active-alerts - client not initialized, call /login first',
      });
    }

    const { first, after, fusionEventId } = req.body ?? {};

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
  (
    req: Request<object, object, GetFusionNotificationHistoryHttpBody>,
    res: Response,
  ) => {
    if (!client && !!res.locals.client) {
      client = res.locals.client;
      client?.initialize(res.locals.jwt);
    }

    if (!client || client.status.status === 'uninitialized') {
      return res.status(400).json({
        message:
          '/publish-fusion-message - client not initialized, call /login first',
      });
    }

    if (!req.body.variables || !Array.isArray(req.body.variables))
      return res.status(400).json({
        message: 'variables field is required & must be an array',
      });
    const fusionMessages = (req.body.variables as unknown[]).filter(
      isFusionMessage,
    );

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
  | ReturnType<NotifiNodeClient['addEventListener']>
  | undefined = undefined;
app.post(
  '/subscribe-active-alert-changed-event',
  notifiAuthMiddleware,
  (
    _req: Request<object, object, SubscribeTenantActiveAlertChangedHttpBody>,
    res: Response,
  ) => {
    if (tenantActiveAlertChangedSubscription)
      return res
        .status(200)
        .json({ message: 'already subscribed, unsubscribe before re-calling' });

    if (!client) {
      client = res.locals.client;
      client?.initialize(res.locals.jwt);
    }

    if (!client || client.status.status === 'uninitialized') {
      return res.status(400).json({
        message:
          'notifi-node: subscribeActiveAlertChangeEvent - client not initialized, call /login first',
      });
    }

    tenantActiveAlertChangedSubscription = client.addEventListener(
      'tenantActiveAlertChanged',
      (event) => {
        if (event.__typename === 'ActiveAlertCreatedEvent')
          console.info(
            `Active alert created, payload: $${JSON.stringify(event)}`,
          );
        if (event.__typename === 'ActiveAlertDeletedEvent')
          console.info(
            `Active alert deleted, payload: $${JSON.stringify(event)}`,
          );
        // Do something with the event
      },
      console.error,
    );

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
  (
    _req: Request<object, object, UnsubscribeTenantActiveAlertChangedHttpBody>,
    res: Response,
  ) => {
    if (!client || client.status.status === 'uninitialized')
      return res.status(400).json({
        message:
          'notifi-node: subscribeTenantActiveAlertChanged - client not initialized, call /login first',
      });

    if (tenantActiveAlertChangedSubscription) {
      try {
        client.removeEventListener(
          'tenantActiveAlertChanged',
          tenantActiveAlertChangedSubscription,
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
  console.info(`Listening on ${port}`);
});

// Utils
const isFusionMessage = (message: unknown): message is FusionMessage => {
  if (!message || typeof message !== 'object') return false;
  const keys = Object.keys(message);
  if (!keys.includes('eventTypeId') || !keys.includes('variablesJson'))
    return false;
  return true;
};
