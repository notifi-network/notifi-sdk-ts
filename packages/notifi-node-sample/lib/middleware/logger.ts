import type { NextFunction, Request, Response } from 'express';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'query-history.log' })
  ],
});

export const loggerMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req._startTime = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      length: res.get('Content-Length') || 0,
      'response-time': `${Date.now() - req._startTime!} ms`,
    });
  });
  next();
};
