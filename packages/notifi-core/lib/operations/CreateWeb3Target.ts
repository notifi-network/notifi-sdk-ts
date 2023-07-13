import { Operation, Web3Target } from '../models';

/**
 * Input param for creating an Web3Target
 *
 * @remarks
 * This describes the values to use for Web3 target
 */

export type CreateWeb3TargetInput = Readonly<{
  name: string;
  value: string;
  protocol: string;
}>;

export type CreateWeb3TargetResult = Web3Target;

export type CreateWeb3TargetService = Readonly<{
  createWeb3Target: Operation<CreateWeb3TargetInput, CreateWeb3TargetResult>;
}>;
