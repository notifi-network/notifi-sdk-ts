import { User, Operation } from '../models';

export type LogInFromDaoInput = Readonly<{
  walletPublicKey: string;
  daoAddress: string;
  timestamp: number;
  signature: string;
}>;

export type LogInFromDaoResult = User;

export type LogInFromDaoService = Readonly<{
  logInFromDao: Operation<LogInFromDaoInput, LogInFromDaoResult>;
}>;
