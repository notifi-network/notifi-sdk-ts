import useNotifiClient from './useNotifiClient';
import { BlockchainEnvironment } from './useNotifiConfig';
import { GqlError } from '@notifi-network/notifi-axios-utils';
import {
  Alert,
  AlertFrequency,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  Filter,
  FilterOptionsBuilder,
  MessageSigner,
  NotifiClient,
  Source,
  SourceGroup,
  TargetGroup,
  User,
} from '@notifi-network/notifi-core';

export type {
  Alert,
  AlertFrequency,
  ClientCreateAlertInput,
  ClientData,
  ClientDeleteAlertInput,
  ClientUpdateAlertInput,
  Filter,
  FilterOptionsBuilder,
  MessageSigner,
  NotifiClient,
  TargetGroup,
  Source,
  SourceGroup,
  User,
};

export { BlockchainEnvironment, GqlError, useNotifiClient };
