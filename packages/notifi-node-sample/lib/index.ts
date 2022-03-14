import { GqlError } from '@notifi-network/notifi-axios-utils';
import {
  NotifiClient,
  NotifiEnvironment,
  createAxiosInstance,
} from '@notifi-network/notifi-node';
import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
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

const axiosInstanceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body: Readonly<{
    env?: string;
  }> = req.body ?? {};
  const notifiEnv = parseEnv(body.env);
  const axiosInstance = createAxiosInstance(axios, notifiEnv);
  AxiosLogger.setGlobalConfig({
    data: true,
    method: true,
    url: true,
    status: true,
    statusText: true,
  });
  axiosInstance.interceptors.request.use(
    AxiosLogger.requestLogger,
    AxiosLogger.errorLogger,
  );
  axiosInstance.interceptors.response.use(
    AxiosLogger.responseLogger,
    AxiosLogger.errorLogger,
  );
  res.locals.axiosInstance = axiosInstance;
  next();
};

app.use(axiosInstanceMiddleware);

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

  const client = new NotifiClient(res.locals.axiosInstance);

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
  } else if (walletBlockchain !== 'SOLANA') {
    return res.status(400).json({
      message: 'Unsupported walletBlockchain',
    });
  }

  if (healthValue === undefined) {
    return res.status(400).json({
      message: 'value is required',
    });
  }

  const client = new NotifiClient(res.locals.axiosInstance);

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

  const client = new NotifiClient(res.locals.axiosInstance);

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

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
