import { GqlError } from '@notifi-network/notifi-axios-utils';
import {
  AcalaSignMessageFunction,
  Alert,
  AlertFrequency,
  AptosSignMessageFunction,
  ClientConfiguration,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  Filter,
  FilterOptions,
  NotifiClient,
  SignMessageParams,
  Source,
  SourceGroup,
  TargetGroup,
  TargetType,
  Uint8SignMessageFunction,
  User,
} from '@notifi-network/notifi-core';

import useNotifiClient, { WalletParams } from './useNotifiClient';
import useNotifiConfig from './useNotifiConfig';
import { BlockchainEnvironment } from './useNotifiConfig';

export type {
  Alert,
  AlertFrequency,
  AptosSignMessageFunction,
  AcalaSignMessageFunction,
  ClientConfiguration,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  Filter,
  FilterOptions,
  NotifiClient,
  TargetGroup,
  TargetType,
  SignMessageParams,
  Source,
  SourceGroup,
  Uint8SignMessageFunction,
  User,
  WalletParams,
};

export { BlockchainEnvironment, GqlError, useNotifiClient, useNotifiConfig };
