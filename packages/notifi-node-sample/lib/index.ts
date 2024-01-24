import { GqlError } from '@notifi-network/notifi-axios-utils';
import { FusionMessage } from '@notifi-network/notifi-dataplane';
import {
  NotifiClient,
  NotifiEnvironment,
  createDataplaneClient,
  createGraphQLClient,
  createNotifiService,
} from '@notifi-network/notifi-node';
import { randomUUID } from 'crypto';
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
  let notifiEnv: NotifiEnvironment = 'Development';
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
  const notifiService = createNotifiService(graphqlClient, dpapiClient);
  res.locals.notifiService = notifiService;
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

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .logIn({ sid, secret })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
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

app.post('/sendSimpleHealthThreshold', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    walletPublicKey,
    walletBlockchain,
    healthValue,
  }: Readonly<{
    walletPublicKey?: string;
    walletBlockchain?: string;
    healthValue?: number;
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

  if (healthValue === undefined) {
    return res.status(400).json({
      message: 'value is required',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .sendSimpleHealthThreshold(jwt, {
      key: randomUUID(),
      walletPublicKey,
      walletBlockchain,
      healthValue,
    })
    .then(() => {
      return res.status(200).json({ message: 'success' });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.post('/deleteUserAlert', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    alertId,
  }: Readonly<{
    alertId?: string;
  }> = req.body ?? {};

  if (alertId === undefined) {
    return res.status(400).json({
      message: 'alertId is required',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .deleteUserAlert(jwt, {
      alertId,
    })
    .then((alertId) => {
      return res.status(200).json({ alertId });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

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

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .createTenantUser(jwt, {
      walletBlockchain,
      walletPublicKey,
    })
    .then((userId) => {
      return res.status(200).json({ userId });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.post('/broadcastMessage', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    topicName,
    message,
    subject,
  }: Readonly<{
    topicName?: string;
    message?: string;
    subject?: string;
  }> = req.body ?? {};

  if (topicName === undefined) {
    return res.status(400).json({
      message: 'topicName is required',
    });
  }

  if (message === undefined) {
    return res.status(400).json({
      message: 'message is required',
    });
  }

  if (subject === undefined) {
    return res.status(400).json({
      message: 'subject is required',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .sendBroadcastMessage(jwt, {
      topicName,
      variables: [
        {
          key: 'message',
          value: message,
        },
        {
          key: 'subject',
          value: subject,
        },
      ],
    })
    .then(() => {
      return res.status(200).json({ success: true });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.post('/createDirectPushAlert', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    userId,
    email,
  }: Readonly<{
    userId?: string;
    email?: string;
  }> = req.body ?? {};

  if (userId === undefined) {
    return res.status(400).json({
      message: 'userId is required',
    });
  }

  if (email === undefined) {
    return res.status(400).json({
      message: 'email is required',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .createDirectPushAlert(jwt, {
      userId,
      emailAddresses: [email],
    })
    .then((alert) => {
      return res.status(200).json({ alert });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.post('/publishFusionMessage', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    variables,
  }: Readonly<{
    variables?: Readonly<FusionMessage[]>;
  }> = req.body ?? {};

  if (!variables) {
    return res.status(400).json({
      message: 'messages is required',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);
  console.log('variables', JSON.parse(JSON.stringify(variables)));
  return client
    .publishFusionMessage(jwt, variables)
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

app.post('/sendDirectPush', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    walletBlockchain,
    walletPublicKey,
    message,
    type,
    template,
  }: Readonly<{
    walletBlockchain?: string;
    walletPublicKey?: string;
    message?: string;
    type?: string; // This is directPushId
    template?: {
      emailTemplate?: string;
      smsTemplate?: string;
      telegramTemplate?: string;
      variables: Record<string, string>;
    };
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

  if (message === undefined && template === undefined) {
    return res.status(400).json({
      message: 'Either message or template is required',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .sendDirectPush(jwt, {
      key: randomUUID(),
      walletPublicKey,
      walletBlockchain,
      message,
      type,
      template,
    })
    .then(() => {
      return res.status(200).json({ message: 'success' });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.post('/addSourceToSourceGroup', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    sourceGroupId,
    sourceId,
    walletAddress,
    sourceType,
  }: Readonly<{
    sourceGroupId?: string;
    sourceId?: string;
    walletAddress?: string;
    sourceType?: string;
  }> = req.body ?? {};

  if (sourceGroupId === undefined) {
    return res.status(400).json({
      message: 'walletPublicKey is required',
    });
  }

  if (sourceId === undefined) {
    if (walletAddress === undefined || sourceType === undefined) {
      return res.status(400).json({
        message:
          'Both walletAddress and sourceType are required if sourceId is not provided',
      });
    }
  } else if (walletAddress !== undefined || sourceType === undefined) {
    return res.status(400).json({
      message: 'Cannot provide both sourceId and walletAddress/sourceType',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .addSourceToSourceGroup(jwt, {
      sourceGroupId,
      sourceId,
      walletAddress,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sourceType: sourceType as any,
    })
    .then((sourceGroup) => {
      return res.status(200).json({ sourceGroup });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.post('/removeSourceFromSourceGroup', authorizeMiddleware, (req, res) => {
  const jwt: string = res.locals.jwt;

  const {
    sourceGroupId,
    sourceId,
    walletAddress,
    sourceType,
  }: Readonly<{
    sourceGroupId?: string;
    sourceId?: string;
    walletAddress?: string;
    sourceType?: string;
  }> = req.body ?? {};

  if (sourceGroupId === undefined) {
    return res.status(400).json({
      message: 'walletPublicKey is required',
    });
  }

  if (sourceId === undefined) {
    if (walletAddress === undefined || sourceType === undefined) {
      return res.status(400).json({
        message:
          'Both walletAddress and sourceType are required if sourceId is not provided',
      });
    }
  } else if (walletAddress !== undefined || sourceType === undefined) {
    return res.status(400).json({
      message: 'Cannot provide both sourceId and walletAddress/sourceType',
    });
  }

  const client = new NotifiClient(res.locals.notifiService);

  return client
    .removeSourceFromSourceGroup(jwt, {
      sourceGroupId,
      sourceId,
      walletAddress,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sourceType: sourceType as any,
    })
    .then((sourceGroup) => {
      return res.status(200).json({ sourceGroup });
    })
    .catch((e: unknown) => {
      let message = 'Unknown server error';
      if (e instanceof GqlError) {
        message = `${e.message}: ${e.getErrorMessages().join(', ')}`;
      } else if (e instanceof Error) {
        message = e.message;
      }

      return res.status(500).json({ message });
    });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
