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
  TargetGroup,
  ThresholdFilterOptions,
  Source,
  SourceGroup,
  User
} from '@notifi-network/notifi-core';
import { GqlError } from '@notifi-network/notifi-axios-adapter';
import useNotifiClient from './useNotifiClient';
import { BlockchainEnvironment } from './useNotifiConfig';

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
  User
};

export { BlockchainEnvironment, GqlError, useNotifiClient };
