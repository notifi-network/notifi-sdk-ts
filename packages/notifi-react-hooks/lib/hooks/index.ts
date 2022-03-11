import useNotifiClient from './useNotifiClient';
import { BlockchainEnvironment } from './useNotifiConfig';
import { GqlError } from '@notifi-network/notifi-axios-utils';
import {
  Alert,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  EmptyFilterOptions,
  Filter,
  FilterOptions,
  MessageSigner,
  NotifiClient,
  Source,
  SourceGroup,
  TargetGroup,
  ThresholdFilterOptions,
  User,
} from '@notifi-network/notifi-core';

export type {
  Alert,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  EmptyFilterOptions,
  Filter,
  FilterOptions,
  MessageSigner,
  NotifiClient,
  TargetGroup,
  Source,
  SourceGroup,
  ThresholdFilterOptions,
  User,
};

export { BlockchainEnvironment, GqlError, useNotifiClient };
