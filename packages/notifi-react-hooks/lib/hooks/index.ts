import { GqlError } from '@notifi-network/notifi-axios-utils';
import {
  Alert,
  AlertFrequency,
  ClientConfiguration,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  Filter,
  FilterOptions,
  MessageSigner,
  NotifiClient,
  Source,
  SourceGroup,
  TargetGroup,
  TargetType,
  User,
} from '@notifi-network/notifi-core';

import useNotifiClient from './useNotifiClient';
import { BlockchainEnvironment } from './useNotifiConfig';

export type {
  Alert,
  AlertFrequency,
  ClientConfiguration,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  Filter,
  FilterOptions,
  MessageSigner,
  NotifiClient,
  TargetGroup,
  TargetType,
  Source,
  SourceGroup,
  User,
};

export { BlockchainEnvironment, GqlError, useNotifiClient };
