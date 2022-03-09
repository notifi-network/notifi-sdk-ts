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
  SourceGroup,
  ThresholdFilterOptions,
  User
};

export { BlockchainEnvironment, GqlError, useNotifiClient };
