import {
  createDataplaneClient,
  createGraphQLClient,
  createNotifiService,
  createNotifiSubscriptionService,
  NotifiEnvironment,
} from '@notifi-network/notifi-node';
import { Request, Response, NextFunction } from 'express';

export const notifiAuthMiddleware = (
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

export type ServiceMiddleWareHttpBody = {
  env?: string;
};
export const notifiServiceMiddleware = (
  req: Request<{}, {}, ServiceMiddleWareHttpBody>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body ?? {};
  const notifiEnv = parseEnv(body.env);
  const graphqlClient = createGraphQLClient(notifiEnv);
  const dpapiClient = createDataplaneClient(notifiEnv);
  const subService = createNotifiSubscriptionService(notifiEnv);
  const notifiService = createNotifiService(graphqlClient, subService);
  res.locals.notifiService = notifiService;
  res.locals.dpapiClient = dpapiClient;
  next();
};

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
